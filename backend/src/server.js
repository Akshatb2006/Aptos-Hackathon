const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campus_wallet')
    .then(() => {
        console.log('✅ MongoDB Connected');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB Error:', err);
        process.exit(1);
    });

const UserModel = require('./infrastructure/database/models/UserModel');
const RewardModel = require('./infrastructure/database/models/RewardModel');
const LedgerModel = require('./infrastructure/database/models/LedgerModel');
const RedemptionModel = require('./infrastructure/database/models/RedemptionModel');

const authRoutes = require('./interfaces/routes/authRoutes');
const studentRoutes = require('./interfaces/routes/studentRoutes');
const adminRoutes = require('./interfaces/routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// server
