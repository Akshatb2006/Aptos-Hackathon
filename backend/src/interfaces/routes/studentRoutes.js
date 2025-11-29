const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const UserModel = require('../../infrastructure/database/models/UserModel');
const RewardModel = require('../../infrastructure/database/models/RewardModel');
const LedgerModel = require('../../infrastructure/database/models/LedgerModel');
const RedemptionModel = require('../../infrastructure/database/models/RedemptionModel');
const QRCode = require('qrcode');

router.get('/balance', authMiddleware, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        res.json({ balance: user.walletBalance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/ledger', authMiddleware, async (req, res) => {
    try {
        const ledger = await LedgerModel.find({ userId: req.userId })
            .sort({ timestamp: -1 })
            .limit(50);
        res.json(ledger);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/rewards', authMiddleware, async (req, res) => {
    try {
        const rewards = await RewardModel.find({ active: true });
        res.json(rewards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/redeem', authMiddleware, async (req, res) => {
    try {
        const { rewardId } = req.body;

        const user = await UserModel.findById(req.userId);
        const reward = await RewardModel.findById(rewardId);

        if (!reward) {
            return res.status(404).json({ error: 'Reward not found' });
        }

        if (!reward.active) {
            return res.status(400).json({ error: 'Reward not available' });
        }

        if (reward.stock === 0) {
            return res.status(400).json({ error: 'Reward out of stock' });
        }

        if (user.walletBalance < reward.pointsCost) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        user.walletBalance -= reward.pointsCost;
        await user.save();

        if (reward.stock > 0) {
            reward.stock -= 1;
            await reward.save();
        }

        const ledgerEntry = new LedgerModel({
            userId: user._id,
            type: 'REDEEM',
            amount: reward.pointsCost,
            description: `Redeemed: ${reward.name}`,
            metadata: { rewardId: reward._id, rewardName: reward.name }
        });
        await ledgerEntry.save();

        const redemptionCode = `CW-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const qrData = JSON.stringify({
            code: redemptionCode,
            userId: user._id,
            rewardId: reward._id,
            timestamp: new Date()
        });
        const qrCode = await QRCode.toDataURL(qrData);

        const redemption = new RedemptionModel({
            userId: user._id,
            rewardId: reward._id,
            pointsSpent: reward.pointsCost,
            status: 'approved',
            qrCode,
            redemptionCode
        });
        await redemption.save();

        res.json({
            message: 'Reward redeemed successfully',
            newBalance: user.walletBalance,
            redemption: {
                code: redemptionCode,
                qrCode,
                reward: reward.name
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/redemptions', authMiddleware, async (req, res) => {
    try {
        const redemptions = await RedemptionModel.find({ userId: req.userId })
            .populate('rewardId')
            .sort({ redeemedAt: -1 });
        res.json(redemptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/redemptions/:id', authMiddleware, async (req, res) => {
    try {
        const redemption = await RedemptionModel.findOne({
            _id: req.params.id,
            userId: req.userId
        }).populate('rewardId');

        if (!redemption) {
            return res.status(404).json({ error: 'Redemption not found' });
        }

        res.json(redemption);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/wallet', authMiddleware, async (req, res) => {
    try {
        const { walletAddress } = req.body;

        if (!walletAddress) {
            return res.status(400).json({ error: 'Wallet address required' });
        }

        const user = await UserModel.findById(req.userId);
        user.walletAddress = walletAddress;
        await user.save();

        res.json({ message: 'Wallet updated', walletAddress });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;