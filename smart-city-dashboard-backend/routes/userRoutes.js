// smart-city-dashboard-backend/routes/userRoutes.js

const express = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken'); // <-- ADD THIS LINE

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id), // <-- UNCOMMENT THIS LINE
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  })
);

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id), // <-- UNCOMMENT THIS LINE
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  })
);

// smart-city-dashboard-backend/routes/userRoutes.js

// ... (existing code for express, asyncHandler, User, generateToken imports) ...
const { protect, admin } = require('../middleware/authMiddleware'); // <-- ADD THIS LINE

// ... (existing router.post('/', ...) and router.post('/login', ...) code) ...

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (requires token)
router.get(
  '/profile',
  protect, // <-- Apply the protect middleware here
  asyncHandler(async (req, res) => {
    // req.user is available here because the 'protect' middleware attached it
    // It contains the user's data (excluding password) fetched from the DB
    const user = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
    };

    res.json(user);
  })
);



module.exports = router;