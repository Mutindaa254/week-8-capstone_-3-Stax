const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

let dbConnection; // To hold the mongoose connection

// Before all tests, connect to a test database
beforeAll(async () => {
  // Set NODE_ENV to 'test' to ensure test-specific configurations
  process.env.NODE_ENV = 'test';
  // Use a separate test database URI
  process.env.MONGO_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/smartcity_test_db';

  // Connect to MongoDB specifically for tests
  dbConnection = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to test MongoDB.');
});

// After each test, clear the database
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany(); // Clear all documents
  }
});

// After all tests, disconnect from the database
afterAll(async () => {
  if (dbConnection) {
    await dbConnection.connection.close(); // Close the mongoose connection
  }
  console.log('Disconnected from test MongoDB.');
  // Reset NODE_ENV if needed for subsequent operations outside of Jest
  process.env.NODE_ENV = 'development';
});

// We no longer export 'app' or 'request' as we'll hit the live server
