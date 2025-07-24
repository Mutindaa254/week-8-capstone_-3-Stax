const axios = require('axios'); // Import axios
const API_URL = 'http://localhost:5000/api/users'; // Base URL for user API

// Store a token for authenticated requests across tests
let authToken = '';

describe('User Authentication API (via Axios)', () => {
  // IMPORTANT: Ensure your backend server is running on http://localhost:5000 before running these tests!

  // Test for user registration
  it('should register a new user successfully', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };
    const res = await axios.post(API_URL, userData);

    expect(res.status).toEqual(201); // Expect 201 Created status
    expect(res.data).toHaveProperty('_id');
    expect(res.data).toHaveProperty('name', 'Test User');
    expect(res.data).toHaveProperty('email', 'test@example.com');
    expect(res.data).toHaveProperty('token'); // Expect a JWT token
  });

  // Test for user login
  it('should log in an existing user successfully and store token', async () => {
    // First, register a user to ensure one exists for login
    const registerData = {
      name: 'Login User',
      email: 'login@example.com',
      password: 'loginpassword',
    };
    await axios.post(API_URL, registerData); // Register the user

    const loginData = {
      email: 'login@example.com',
      password: 'loginpassword',
    };
    const res = await axios.post(`${API_URL}/login`, loginData);

    expect(res.status).toEqual(200); // Expect 200 OK status
    expect(res.data).toHaveProperty('_id');
    expect(res.data).toHaveProperty('email', 'login@example.com');
    expect(res.data).toHaveProperty('token');
    authToken = res.data.token; // Store the token for subsequent tests
  });

  // Test for getting user profile (requires authentication)
  it('should get authenticated user profile', async () => {
    // Ensure a token is available from a previous login
    if (!authToken) {
      // If no token, perform a quick login to get one
      const loginData = { email: 'admin@example.com', password: 'password123' }; // Use your seeder admin or a known user
      const loginRes = await axios.post(`${API_URL}/login`, loginData);
      authToken = loginRes.data.token;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    const res = await axios.get(`${API_URL}/profile`, config);

    expect(res.status).toEqual(200);
    expect(res.data).toHaveProperty('name');
    expect(res.data).toHaveProperty('email');
    expect(res.data).toHaveProperty('isAdmin');
  });

  // Test for login with invalid credentials
  it('should return 401 for invalid login credentials', async () => {
    try {
      await axios.post(`${API_URL}/login`, {
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      });
      // If the above line doesn't throw, the test should fail
      fail('Login with invalid credentials should have failed');
    } catch (error) {
      expect(error.response.status).toEqual(401); // Expect 401 Unauthorized
      expect(error.response.data).toHaveProperty('message', 'Invalid email or password');
    }
  });

  // Test for unauthorized profile access
  it('should return 401 for unauthorized profile access', async () => {
    try {
      await axios.get(`${API_URL}/profile`); // No token provided
      fail('Unauthorized profile access should have failed');
    } catch (error) {
      expect(error.response.status).toEqual(401);
      expect(error.response.data).toHaveProperty('message', 'Not authorized, no token');
    }
  });
});
