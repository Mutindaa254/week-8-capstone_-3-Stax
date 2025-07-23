const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User'); // Assuming you have a User model
const SensorData = require('./models/SensorData'); // Import the new SensorData model

dotenv.config(); // Load environment variables
connectDB(); // Connect to MongoDB

const importData = async () => {
  try {
    // Clear existing data (optional, but good for fresh imports)
    await User.deleteMany();
    await SensorData.deleteMany();

    // Create a default admin user (if you want one for testing)
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123', // Mongoose pre-save hook should hash this
      isAdmin: true,
    });
    console.log('Admin user created!');

    // Sample Sensor Data
    const sampleSensorData = [
      {
        type: 'Temperature',
        value: 25.5,
        unit: '°C',
        location: 'City Center',
      },
      {
        type: 'Humidity',
        value: 60.2,
        unit: '%',
        location: 'Industrial Zone',
      },
      {
        type: 'Air Quality',
        value: 35,
        unit: 'AQI',
        location: 'Residential Area',
      },
      {
        type: 'Noise Level',
        value: 70,
        unit: 'dB',
        location: 'Downtown',
      },
      {
        type: 'Traffic Count',
        value: 1200,
        unit: 'vehicles/hr',
        location: 'Main Road',
      },
      {
        type: 'Temperature',
        value: 23.1,
        unit: '°C',
        location: 'Residential Area',
      },
    ];

    await SensorData.insertMany(sampleSensorData);
    console.log('Sensor Data Imported!');

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await SensorData.deleteMany();
    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// Check command line arguments to determine action
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
