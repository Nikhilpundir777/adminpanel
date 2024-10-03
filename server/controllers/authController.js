const { usermodel } = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { z } = require('zod');

// Zod schemas for validation
const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

const signupSchema = z.object({
    username: z.string(),
    password: z.string(),
});

// Generate JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
};

// Admin Signup
exports.signup = async (req, res) => {
    try {
        const { username, password } = signupSchema.parse(req.body);

        // Check if the user already exists
        const existingUser = await usermodel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ status: 'fail', message: 'Username already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user
        const newUser = await usermodel.create({
            username,
            password: hashedPassword,
        });

        const token = signToken(newUser._id);
        res.status(201).json({ status: 'success', token });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.errors ? err.errors : err.message,
        });
    }
};

// Admin Login
exports.login = async (req, res) => {
    try {
        const { username, password } = loginSchema.parse(req.body);

        if (!username || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please provide username and password' });
        }

        const admin = await usermodel.findOne({ username }).select('+password');
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ status: 'fail', message: 'Incorrect username or password' });
        }

        const token = signToken(admin._id);
        res.status(200).json({ status: 'success', token });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.errors ? err.errors : err.message,
        });
    }
};

// Protect routes (Admin only)
exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ status: 'fail', message: 'You are not logged in!' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await usermodel.findById(decoded.id);
        if (!admin) {
            return res.status(401).json({ status: 'fail', message: 'Admin does not exist' });
        }

        req.user = admin;
        next();
    } catch (err) {
        return res.status(400).json({ status: 'fail', message: err.message });
    }
};
