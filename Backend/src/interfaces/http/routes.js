const express = require('express');
const AuthService = require('../../application/auth/auth.service');
const WalletService = require('../../application/wallet/wallet.service');
const User = require('../../domain/user/user.model');

const router = express.Router();

// Auth Routes
router.post('/auth/login', async (req, res) => {
    try {
        const { walletAddress, name, email, role } = req.body;
        const user = await AuthService.login(walletAddress, { name, email, role });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Wallet Routes
router.get('/wallet/balance', async (req, res) => {
    try {
        const { walletAddress } = req.query;
        const user = await User.findOne({ walletAddress });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const balance = await WalletService.getBalance(user._id);
        res.json({ balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/wallet/history', async (req, res) => {
    try {
        const { walletAddress } = req.query;
        const user = await User.findOne({ walletAddress });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const history = await WalletService.getHistory(user._id);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dev/Admin Route to simulate earning
router.post('/rewards/earn', async (req, res) => {
    try {
        const { walletAddress, amount, reason } = req.body;
        const event = await WalletService.earnPoints(walletAddress, amount, reason);
        res.json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
