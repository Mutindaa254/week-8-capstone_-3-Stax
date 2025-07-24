Smart City Dashboard User Guide
This guide provides instructions on how to access and use the deployed Smart City Dashboard application.

1. Accessing the Application
Deployed Frontend URL: https://imaginative-swan-dba653.netlify.app

Deployed Backend API URL: https://week-8-capstone_-3-stax.onrender.com

Important Note on Frontend Navigation:
Due to a persistent configuration challenge with client-side routing on Netlify, directly navigating to sub-paths (e.g., /login, /dashboard) might result in a "Page not found" error. To ensure full functionality, please access the application via the root URL (https://imaginative-swan-dba653.netlify.app) and use the in-app navigation links (Login, Register, Dashboard, Profile) to move between pages.

2. Getting Started
2.1 Registering a New Account
Open the application in your browser: https://imaginative-swan-dba653.netlify.app

Click on the "Register" link in the navigation bar.

Fill in the registration form with your desired Username, Email, and Password.

Click the "Register" button.

Upon successful registration, you will be redirected to the Login page.

2.2 Logging In
Open the application in your browser: https://imaginative-swan-dba653.netlify.app

Click on the "Login" link in the navigation bar.

Enter your registered Email and Password.

Default Admin User (for testing): You can also use the seeded admin account:

Email: admin@example.com

Password: password123

Click the "Login" button.

Upon successful login, you will be redirected to the Dashboard.

3. Using the Dashboard
The Dashboard displays real-time sensor data from various smart city sensors.

Accessing: After logging in, you will automatically be taken to the Dashboard. You can also click the "Dashboard" link in the navigation bar.

Real-time Updates: New sensor data will appear on the dashboard automatically as it is generated or added to the system.

4. Viewing Your Profile
The Profile screen displays your user information.

Accessing: After logging in, click the "Profile" link in the navigation bar.

Details: You will see your User ID, Name, Email, and whether you have administrative privileges.

5. Logging Out
To log out, navigate to the Profile screen and click the "Logout" button. This will clear your session and redirect you to the Login page.

6. Testing Real-time Data (Advanced - for Demonstrators/Evaluators)
To demonstrate the real-time data functionality:

Ensure you are logged into the deployed frontend and are on the Dashboard screen.

Use a tool like Postman or Insomnia to make a POST request to the deployed backend's sensor endpoint:

URL: https://week-8-capstone_-3-stax.onrender.com/api/sensors

Method: POST

Headers:

Content-Type: application/json

Authorization: Bearer <YOUR_JWT_TOKEN> (Obtain a valid JWT token by logging in via the deployed frontend, then inspect local storage or network requests).

Body (raw JSON):

{
    "type": "Temperature",
    "value": 25.5,
    "unit": "°C",
    "location": "Central Park"
}

(Adjust type, value, unit, location as needed.)

Send the request. The new data should immediately appear on the deployed dashboard in your browser.