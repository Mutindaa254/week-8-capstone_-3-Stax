const mongoose = require('mongoose');

const sensorDataSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['Temperature', 'Humidity', 'Air Quality', 'Noise Level', 'Traffic Count'], // Example types
    },
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    // You can add more fields as needed, e.g., sensorId, cityArea
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

const SensorData = mongoose.model('SensorData', sensorDataSchema);

module.exports = SensorData;
