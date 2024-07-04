const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/UserModel');

dotenv.config();

const sessionAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'No credentials provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ mobile: decoded.mobile });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.userType = 'user';
        req.user = user;
        next();
    } catch (err) {
        console.error(err.message);
        res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = sessionAuth;