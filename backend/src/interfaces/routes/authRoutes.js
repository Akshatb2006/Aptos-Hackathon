const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../../infrastructure/database/models/UserModel');

router.post('/register', async (req, res) => {
    try {
        const { email, password, name, rollNumber, role } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        const nameRegex = /^[a-zA-Z\s]+$/;
        const rollNumberRegex = /^[a-zA-Z0-9]+$/;

        if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email address' });
        if (!passwordRegex.test(password)) return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least one letter and one number' });
        if (!nameRegex.test(name)) return res.status(400).json({ error: 'Name must contain only alphabets and spaces' });
        if (!rollNumberRegex.test(rollNumber)) return res.status(400).json({ error: 'Roll Number must be alphanumeric' });

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({
            email,
            password: hashedPassword,
            name,
            rollNumber,
            role: role || 'student',
            walletBalance: 0
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                walletBalance: user.walletBalance
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email address' });

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                walletBalance: user.walletBalance
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
        const user = await UserModel.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

router.post('/keyless-login', async (req, res) => {
    try {
        const { walletAddress, email, name } = req.body;

        if (!walletAddress) {
            return res.status(400).json({ error: 'Wallet address required' });
        }

        const walletRegex = /^0x[a-fA-F0-9]+$/;
        if (!walletRegex.test(walletAddress)) {
            return res.status(400).json({ error: 'Invalid wallet address' });
        }

        let user = await UserModel.findOne({ walletAddress });

        if (!user) {
            user = new UserModel({
                email: email || `${walletAddress.slice(0, 8)}@aptos.wallet`,
                name: name || `User ${walletAddress.slice(0, 6)}`,
                walletAddress,
                authMethod: 'keyless',
                role: 'student',
                walletBalance: 0,
                password: Math.random().toString(36) 
            });
            await user.save();
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                walletBalance: user.walletBalance,
                walletAddress: user.walletAddress
            }
        });
    } catch (error) {
        console.error('Keyless login error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;