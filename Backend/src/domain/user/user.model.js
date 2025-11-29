const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: { type: String },
    email: { type: String },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema);
