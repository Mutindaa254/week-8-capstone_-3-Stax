    const express = require('express');
    const dotenv = require('dotenv');
    const connectDB = require('./config/db');
    const userRoutes = require('./routes/userRoutes');
    const sensorRoutes = require('./routes/sensorRoutes');
    const cors = require('cors');
    const { notFound, errorHandler } = require('./middleware/errorMiddleware');
    const path = require('path'); // Import path module

    const http = require('http');
    const { Server } = require('socket.io');

    dotenv.config();

    connectDB(); // Connect to DB when server.js is loaded

    const app = express();

    app.use(express.json());

    // CORS Configuration
    if (process.env.NODE_ENV === 'production' && process.env.CLIENT_URL) {
      // In production, allow requests only from your deployed frontend URL
      app.use(cors({ origin: process.env.CLIENT_URL }));
    } else {
      // In development, allow requests from localhost:3000
      app.use(cors({ origin: 'http://localhost:3000' }));
    }


    // API Routes
    app.use('/api/users', userRoutes);
    app.use('/api/sensors', sensorRoutes);

    // ------------------- Deployment Configuration -------------------
    // Serve static assets in production
    if (process.env.NODE_ENV === 'production') {
      // Set static folder (assuming your frontend build is in a 'build' folder relative to backend)
      app.use(express.static(path.join(__dirname, '../smart-city-dashboard-frontend/build')));

      // Any requests that are not API routes will be served by the frontend's index.html
      app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, '../smart-city-dashboard-frontend', 'build', 'index.html'))
      );
    } else {
      // Development root route
      app.get('/', (req, res) => {
        res.send('API is running...');
      });
    }
    // ----------------------------------------------------------------

    // Error handling middleware (should be last middleware)
    app.use(notFound);
    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;

    // Create HTTP server from Express app
    const server = http.createServer(app); 

    // Initialize Socket.io server
    const io = new Server(server, {
      cors: {
        origin: process.env.NODE_ENV === 'production' && process.env.CLIENT_URL ? process.env.CLIENT_URL : 'http://localhost:3000',
        methods: ["GET", "POST"]
      }
    });

    // Make io instance available to routes
    app.set('io', io);

    // Socket.io connection handling
    io.on('connection', (socket) => {
      console.log('A user connected via Socket.io');
      socket.emit('message', 'Welcome to the Smart City Dashboard real-time updates!');
      socket.on('disconnect', () => {
        console.log('User disconnected from Socket.io');
      });
    });

    // Change app.listen to server.listen for Socket.io to work
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT} with Socket.io in ${process.env.NODE_ENV} mode`);
    });

    module.exports = app; // Export the Express app instance for testing
    