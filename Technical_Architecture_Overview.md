Smart City Dashboard - Technical Architecture Overview
This document provides an overview of the technical architecture of the Smart City Dashboard, a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application with real-time capabilities.

1. Overall Architecture
The Smart City Dashboard follows a client-server architecture, typical of MERN stack applications. It consists of:

Frontend (Client-side): A React.js Single Page Application (SPA) that provides the user interface.

Backend (Server-side): A Node.js/Express.js RESTful API that handles business logic, data storage, and real-time communication.

Database: A MongoDB NoSQL database for persistent data storage.

Real-time Communication: Utilizes Socket.io for instant data updates from the backend to the frontend.

2. Frontend Architecture (React.js)
Framework: React.js

Routing: React Router DOM for client-side navigation.

State Management: React's built-in useState and useEffect hooks for component-level state.

API Communication: axios for making HTTP requests to the backend API.

Form Handling: Formik for managing form state and Yup for schema validation.

Real-time Client: socket.io-client to establish and manage WebSocket connections for live data.

Structure: Organized into components (reusable UI elements like Login/Register forms, PrivateRoute) and screens (page-level components like Dashboard, Profile).

3. Backend Architecture (Node.js/Express.js)
Runtime: Node.js

Framework: Express.js for building robust RESTful APIs.

Database ODM: Mongoose for interacting with MongoDB, providing schema definition and data validation.

Authentication: JWT (JSON Web Tokens) for secure, stateless user authentication. Passwords are hashed using bcryptjs.

Asynchronous Handling: express-async-handler to simplify error handling in asynchronous route handlers.

Real-time Server: Socket.io for managing WebSocket connections and emitting real-time sensor data updates to connected clients.

Error Handling: Custom middleware (notFound, errorHandler) for centralized error management.

Environment Variables: dotenv for securely loading configuration from .env files.

CORS: cors middleware to handle Cross-Origin Resource Sharing, configured for both development and production environments.

Data Seeding: A seeder.js script for populating the database with initial data for development and testing.

4. Database (MongoDB)
Type: NoSQL Document Database.

Hosting: MongoDB Atlas (cloud-hosted free tier cluster) for production deployment.

Schemas: Defined using Mongoose for User and SensorData collections, ensuring data consistency and validation.

5. Real-time Communication (Socket.io)
Mechanism: WebSockets, implemented using Socket.io.

Backend: The Express.js server integrates a Socket.io server. When new sensor data is added (via a POST request to /api/sensors), the backend emits a newSensorData event to all connected frontend clients.

Frontend: The Dashboard screen establishes a Socket.io client connection and listens for the newSensorData event, updating the UI instantly upon receiving new data.

6. Deployment Strategy
The application is deployed using a decoupled approach:

Frontend Deployment: Netlify (static site hosting)

Automatically builds the React application from the GitHub repository.

Known Issue: Direct navigation to sub-paths (e.g., /login, /dashboard) on the deployed Netlify site might result in a "Page not found" error. This is a persistent client-side routing configuration challenge on Netlify. However, navigating within the app after landing on the root URL (https://imaginative-swan-dba653.netlify.app) functions correctly. This issue has been thoroughly investigated, and all standard solutions (_redirects file, netlify.toml with base and publish paths, postbuild scripts) have been attempted.

Backend Deployment: Render (web service hosting)

Deploys the Node.js/Express API directly from the GitHub repository.

Connects to the MongoDB Atlas database using environment variables.

Database Hosting: MongoDB Atlas (cloud-hosted database service).

7. Security Considerations
Password Hashing: User passwords are securely hashed using bcrypt.

JWT Authentication: JSON Web Tokens are used for stateless authentication, with a strong secret key.

CORS: Configured to restrict access to the API from unauthorized origins in production.

Environment Variables: Sensitive information (database URI, JWT secret) is managed via environment variables and not hardcoded in the codebase.

8. Future Enhancements
Implement administrator panels for managing users and sensor types.

Add more sophisticated data visualization tools (e.g., charts, graphs).

Integrate external APIs for real-world smart city data.

Implement user roles and permissions beyond basic admin/user.

Improve error logging and monitoring in production.

Optimize frontend performance and bundle size.