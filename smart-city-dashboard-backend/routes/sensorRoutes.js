const express = require('express');
const asyncHandler = require('express-async-handler');
const SensorData = require('../models/SensorData');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @desc    Get all sensor data
// @route   GET /api/sensors
// @access  Private (requires authentication)
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const sensorData = await SensorData.find({});
    res.json(sensorData);
  })
);

// @desc    Add new sensor data (for admin or automated systems)
// @route   POST /api/sensors
// @access  Private/Admin (you might add 'admin' middleware later)
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { type, value, unit, location } = req.body;

    const sensorData = new SensorData({
      type,
      value,
      unit,
      location,
    });

    const createdSensorData = await sensorData.save();

    // Get the Socket.io instance from the app object
    const io = req.app.get('io'); 
    // Emit a 'newSensorData' event with the new data to all connected clients
    io.emit('newSensorData', createdSensorData); 
    console.log('Emitted newSensorData via Socket.io:', createdSensorData.type); // Log for debugging

    res.status(201).json(createdSensorData);
  })
);


module.exports = router;
