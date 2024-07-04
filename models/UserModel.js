const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const sessionSchema = new mongoose.Schema({
    sessionKey: { type: String, required: true },
    userAgent: { type: String, required: true },
    ipAddress: { type: String, required: true },
    status: { type: String, enum: ['active', 'invalidated'], default: 'active' }
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
    mobile: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    sessions: [sessionSchema]
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
