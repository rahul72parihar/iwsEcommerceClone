import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

/* =========================
   Helper: Generate JWT
========================= */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/* =========================
   @desc    Register user
   @route   POST /api/auth/register
========================= */
router.post('/register', async (req, res) => {
  try {
    let { name, email, password } = req.body;

    email = email?.toLowerCase();

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('REGISTER ERROR:', error);

    // 🔥 1. Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);

      return res.status(400).json({
        message: messages[0], // first error
        errors: messages      // all errors (optional)
      });
    }

    // 🔥 2. Duplicate email
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Email already registered'
      });
    }

    // 🔥 3. Fallback
    res.status(500).json({
      message: 'Server error'
    });
  }
});

/* =========================
   @desc    Login user
   @route   POST /api/auth/login
========================= */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // 🔥 Find user with password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 🔥 Compare password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* =========================
   @desc    Get current user
   @route   GET /api/auth/me
========================= */
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('AUTH ME ERROR:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
});

export default router;