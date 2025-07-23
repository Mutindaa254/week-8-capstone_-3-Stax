const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./server'); // Import your Express app instance
const request = require('supertest'); // Import supertest

dotenv.config();

let mongoServer;
let serverInstance; // To hold the server instance for closing

// Before all tests, connect to a test database
beforeAll(async () => {
  // Use a different environment variable for test MongoDB URI
  // Or, if you have `mongodb-memory-server` installed, you can use that for a truly isolated test DB
  // For simplicity, we'll use a separate DB name on localhost for now.
  process.env.MONGO_URI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/smartcity_test_db';

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Start the server for testing
  // We need to get the actual server instance from app.listen
  serverInstance = app.listen(process.env.PORT || 5000, () => {
    console.log(`Test server running on port ${process.env.PORT || 5000}`);
  });
});

// After each test, clear the database
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany(); // Clear all documents
  }
});

// After all tests, disconnect from the database and close the server
afterAll(async () => {
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
  if (serverInstance) {
    await serverInstance.close(); // Close the HTTP server
  }
});

// Export app and request for use in test files
module.exports = { app, request };
