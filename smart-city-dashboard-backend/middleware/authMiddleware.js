// smart-city-dashboard-backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // We need the User model to find the user by ID

// This middleware function will protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (removes 'Bearer ' prefix)
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      // jwt.verify takes the token and your JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID from the decoded token payload
      // Select '-password' means to return all user data EXCEPT the password field
      req.user = await User.findById(decoded.id).select('-password');

      // Move to the next middleware or route handler
      next();
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(401); // Unauthorized
      throw new Error('Not authorized, token failed');
    }
  }

  // If no token is found in the header
  if (!token) {
    res.status(401); // Unauthorized
    throw new Error('Not authorized, no token');
  }
});

// Middleware for admin access (optional, but good for dashboards)
const admin = (req, res, next) => {
  // Check if the authenticated user (from req.user set by 'protect' middleware) is an admin
  if (req.user && req.user.isAdmin) {
    next(); // If admin, proceed to the next middleware/route handler
  } else {
    res.status(401); // Unauthorized
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { protect, admin }; // Export both middleware functions