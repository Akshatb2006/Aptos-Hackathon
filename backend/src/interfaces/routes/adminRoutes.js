const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');
const UserModel = require('../../infrastructure/database/models/UserModel');
const RewardModel = require('../../infrastructure/database/models/RewardModel');
const LedgerModel = require('../../infrastructure/database/models/LedgerModel');
const RedemptionModel = require('../../infrastructure/database/models/RedemptionModel');

const upload = multer({ dest: 'uploads/' });

router.post('/award-points', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { userId, points, description } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.walletBalance += points;
    await user.save();

    const ledgerEntry = new LedgerModel({
      userId: user._id,
      type: 'EARN',
      amount: points,
      description: description || 'Manual award by admin',
      metadata: { awardedBy: req.userId }
    });
    await ledgerEntry.save();

    res.json({
      message: 'Points awarded successfully',
      newBalance: user.walletBalance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/upload-attendance', authMiddleware, adminOnly, upload.single('file'), async (req, res) => {
  try {
    const results = [];
    const pointsPerAttendance = parseInt(req.body.pointsPerAttendance) || 10;

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          const processed = [];
          const errors = [];

          for (const row of results) {
            const identifier = row.email || row.rollNumber;
            if (!identifier) {
              errors.push({ row, error: 'Missing identifier' });
              continue;
            }

            const user = await UserModel.findOne({
              $or: [{ email: identifier }, { rollNumber: identifier }]
            });

            if (!user) {
              errors.push({ row, error: 'User not found' });
              continue;
            }

            user.walletBalance += pointsPerAttendance;
            await user.save();

            const ledgerEntry = new LedgerModel({
              userId: user._id,
              type: 'EARN',
              amount: pointsPerAttendance,
              description: `Attendance: ${row.date || new Date().toLocaleDateString()}`,
              metadata: { 
                date: row.date,
                uploadedBy: req.userId 
              }
            });
            await ledgerEntry.save();

            processed.push({
              name: user.name,
              email: user.email,
              pointsAwarded: pointsPerAttendance
            });
          }

          fs.unlinkSync(req.file.path);

          res.json({
            message: 'Attendance processed',
            processed: processed.length,
            errors: errors.length,
            details: { processed, errors }
          });
        } catch (error) {
          fs.unlinkSync(req.file.path);
          res.status(500).json({ error: error.message });
        }
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/rewards', authMiddleware, adminOnly, async (req, res) => {
  try {
    const reward = new RewardModel(req.body);
    await reward.save();
    res.status(201).json(reward);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/rewards/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const reward = await RewardModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }
    res.json(reward);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/rewards/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const reward = await RewardModel.findByIdAndDelete(req.params.id);
    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }
    res.json({ message: 'Reward deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/rewards', authMiddleware, adminOnly, async (req, res) => {
  try {
    const rewards = await RewardModel.find();
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await UserModel.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/analytics', authMiddleware, adminOnly, async (req, res) => {
  try {
    const totalUsers = await UserModel.countDocuments({ role: 'student' });
    const totalPointsIssued = await LedgerModel.aggregate([
      { $match: { type: 'EARN' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalPointsRedeemed = await LedgerModel.aggregate([
      { $match: { type: 'REDEEM' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRedemptions = await RedemptionModel.countDocuments();
    const activeRewards = await RewardModel.countDocuments({ active: true });

    const topStudents = await UserModel.find({ role: 'student' })
      .sort({ walletBalance: -1 })
      .limit(10)
      .select('name email walletBalance');

    const popularRewards = await RedemptionModel.aggregate([
      {
        $group: {
          _id: '$rewardId',
          count: { $sum: 1 },
          totalPoints: { $sum: '$pointsSpent' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    await RewardModel.populate(popularRewards, { path: '_id' });

    res.json({
      totalUsers,
      totalPointsIssued: totalPointsIssued[0]?.total || 0,
      totalPointsRedeemed: totalPointsRedeemed[0]?.total || 0,
      totalRedemptions,
      activeRewards,
      topStudents,
      popularRewards
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/redemptions', authMiddleware, adminOnly, async (req, res) => {
  try {
    const redemptions = await RedemptionModel.find()
      .populate('userId', 'name email')
      .populate('rewardId')
      .sort({ redeemedAt: -1 });
    res.json(redemptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/verify-redemption', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { redemptionCode } = req.body;

    const redemption = await RedemptionModel.findOne({ redemptionCode })
      .populate('userId', 'name email')
      .populate('rewardId');

    if (!redemption) {
      return res.status(404).json({ error: 'Redemption not found' });
    }

    if (redemption.status === 'used') {
      return res.status(400).json({ error: 'Redemption already used' });
    }

    redemption.status = 'used';
    redemption.usedAt = new Date();
    await redemption.save();

    res.json({
      message: 'Redemption verified',
      redemption
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;