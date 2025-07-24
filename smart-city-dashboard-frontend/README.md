Smart City Dashboard Frontend
This repository contains the frontend application for the Smart City Dashboard, built using React.js. It provides a user interface for authentication, displaying real-time sensor data, and managing user profiles.

Features
User Authentication: Login and registration forms with client-side validation using Formik and Yup.

Protected Routes: Dashboard and Profile screens are protected, requiring user authentication.

Real-time Sensor Data Display: Connects to the backend via Socket.io to display live updates of sensor readings.

User Profile Management: Displays authenticated user's details.

Responsive Design: (Add if applicable, e.g., "Designed to be responsive across various devices.")

Technologies Used
React.js: JavaScript library for building user interfaces.

React Router DOM: For client-side routing.

Axios: For making HTTP requests to the backend API.

Formik & Yup: For form management and validation.

Socket.io Client: For real-time communication with the backend.

CSS: For styling.

Getting Started
Follow these steps to set up and run the frontend locally.

Prerequisites
Node.js (v18 or higher recommended)

pnpm (or npm/yarn)

The Smart City Dashboard Backend running locally or deployed.

Installation
Clone the repository:

git clone [https://github.com/PLP-MERN-Stack-Development/week-8-capstone_-3-Stax.git](https://github.com/PLP-MERN-Stack-Development/week-8-capstone_-3-Stax.git)
cd week-8-capstone_-3-Stax/smart-city-dashboard-frontend

(Note: The main repository contains both frontend and backend.)

Install dependencies:

pnpm install

Ensure Backend is Running:
The frontend expects the backend API to be available.

Local Backend: Ensure your backend is running on http://localhost:5000.

Deployed Backend: The deployed frontend is configured to use the deployed backend, but for local development, you might need to temporarily adjust API_BASE_URL in src/App.jsx, src/components/LoginScreen.jsx, src/components/RegisterScreen.jsx, src/screens/ProfileScreen.jsx, and src/screens/DashboardScreen.jsx if you want it to point to your local backend. The current code points to the deployed backend.

Running the Application
To start the frontend application:

pnpm start

The application will open in your browser, typically at http://localhost:3000.

Deployment
The frontend is deployed on Netlify.

Deployed Frontend URL: https://imaginative-swan-dba653.netlify.app

Deployed Backend URL: https://week-8-capstone_-3-stax.onrender.com

Note on Client-Side Routing (Page Not Found Issue):
When navigating directly to sub-paths (e.g., /login, /dashboard) on the deployed Netlify site, you might encounter a "Page not found" error. This is a common issue with Single Page Applications (SPAs) and static hosting. We have implemented a netlify.toml file (or _redirects file with a postbuild script) to redirect all unmatched paths to index.html for client-side routing. Despite these efforts, the issue has been persistent on direct URL access. However, navigating within the app after landing on the root (/) should function correctly. The core application functionality (authentication, data display, real-time updates) is working when accessed through the application's internal navigation.

Usage
Register: Create a new user account.

Login: Log in with your registered credentials or the seeded admin user (admin@example.com, password password123).

Dashboard: View real-time sensor data updates.

Profile: View your user profile details.

Contributing
(Optional: Instructions for how others can contribute to your project.)

License
(Optional: Your project's license.)