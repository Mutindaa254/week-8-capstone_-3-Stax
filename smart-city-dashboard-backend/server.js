const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Now imports the connectDB function
const userRoutes = require('./routes/userRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express(); // Define app instance here

app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/sensors', sensorRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Only connect to DB and start server if not in test environment
// When running tests, setupTests.js will handle DB connection and server start/stop
if (process.env.NODE_ENV !== 'test') {
  connectDB(); // Connect to DB only when running normally

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected via Socket.io');
    socket.emit('message', 'Welcome to the Smart City Dashboard real-time updates!');
    socket.on('disconnect', () => {
      console.log('User disconnected from Socket.io');
    });
  });
  app.set('io', io);

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} with Socket.io`);
  });
}

module.exports = app; // Export the Express app instance for testing
