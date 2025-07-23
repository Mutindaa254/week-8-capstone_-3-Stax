const request = require('supertest');
const { app } = require('../setupTests'); // Import app from the test setup

describe('User Authentication API', () => {
  // Test for user registration
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(201); // Expect 201 Created status
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name', 'Test User');
    expect(res.body).toHaveProperty('email', 'test@example.com');
    expect(res.body).toHaveProperty('token'); // Expect a JWT token
  });

  // Test for user login
  it('should log in an existing user successfully', async () => {
    // First, register a user to ensure one exists for login
    await request(app)
      .post('/api/users')
      .send({
        name: 'Login User',
        email: 'login@example.com',
        password: 'loginpassword',
      });

    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'login@example.com',
        password: 'loginpassword',
      });

    expect(res.statusCode).toEqual(200); // Expect 200 OK status
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('email', 'login@example.com');
    expect(res.body).toHaveProperty('token');
  });

  // Test for login with invalid credentials
  it('should return 401 for invalid login credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(401); // Expect 401 Unauthorized
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });

  // You can add more tests here, e.g., for profile access, admin routes, etc.
});
