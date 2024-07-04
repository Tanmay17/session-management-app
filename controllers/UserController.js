const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const createUser = async (req, res) => {
    const { mobile, username, password } = req.body;
    try {
        let user = await User.findOne({ mobile });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            mobile,
            username,
            password,
            sessions: []
        });

        const sessionKey = jwt.sign({ mobile }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const session = {
            sessionKey,
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip,
            status: 'active'
        };

        user.sessions.push(session);
        await user.save();

        res.status(201).json({ mobile, username, activeSession: sessionKey, sessions: user.sessions });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const doGetUser = async (req, res) => {
    const { mobile } = req.params;

    try {
        const user = await User.findOne({ mobile });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            mobile_number: user.mobile,
            user_name: user.username,
            activeSession: user.sessions.find(session => session.status === 'active')?.sessionKey || null,
            sessions: user.sessions
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const loginUser = async (req, res) => {
    const { mobile, password } = req.body;

    try {
        const user = await User.findOne({ mobile });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const sessionKey = jwt.sign({ mobile }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const newSession = {
            sessionKey,
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip,
            status: 'active'
        };

        // Check for existing active sessions and invalidate them
        const activeSessions = user.sessions.filter(session => session.status === 'active');
        if (activeSessions.length > 0) {
            activeSessions.forEach(session => {
                session.status = 'invalidated';
            });
            await user.save();
            return res.status(400).json({
                message: 'There were active sessions. They have been invalidated. Please log in again.',
                sessionsInvalidated: activeSessions.map(session => session.sessionKey)
            });
        }

        // If no active sessions, create a new session
        user.sessions.push(newSession);
        await user.save();

        res.json({ mobile, username: user.username, activeSession: sessionKey, sessions: user.sessions });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { sessions: 1 });

        res.json(users.map(user => ({
            mobile: user.mobile,
            sessions: user.sessions
        })));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
    createUser,
    doGetUser,
    loginUser,
    getAllUsers
};
