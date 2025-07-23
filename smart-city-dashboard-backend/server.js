const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Socket.io imports
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

// Connect to DB (this will run when server.js is required by tests)
connectDB();

const app = express(); // Define app here

app.use(express.json());
app.use(cors());

// Create HTTP server from Express app (only if not in test environment)
// This logic ensures the server is only explicitly started when running normally,
// not when imported for testing by Supertest.
let server;
if (process.env.NODE_ENV !== 'test') {
  server = http.createServer(app);
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
}


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

// Only listen if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} with Socket.io`);
  });
}

module.exports = app; // EXPORT THE EXPRESS APP INSTANCE
