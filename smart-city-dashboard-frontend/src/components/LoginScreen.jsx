    import React, { useState } from 'react';
    import { Formik, Form, Field, ErrorMessage } from 'formik';
    import * as Yup from 'yup';
    import axios from 'axios';
    import { Link, useNavigate } from 'react-router-dom';

    // Define your deployed backend API base URL
    const API_BASE_URL = 'https://week-8-capstone_-3-stax.onrender.com/api'; // <--- UPDATED BASE URL

    function LoginScreen() {
      const navigate = useNavigate();
      const [loginError, setLoginError] = useState('');

      const LoginSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
      });

      const handleSubmit = async (values, { setSubmitting }) => {
        setLoginError(''); // Clear previous errors
        try {
          const response = await axios.post(`${API_BASE_URL}/users/login`, { // <--- UPDATED URL
            email: values.email,
            password: values.password,
          });

          // Store token and user info (optional) in localStorage
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data)); // Store user data

          console.log('Login successful:', response.data);
          navigate('/dashboard'); // Redirect to dashboard or profile page
        } catch (error) {
          console.error('Login error:', error.response ? error.response.data : error.message);
          setLoginError(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
          setSubmitting(false);
        }
      };

      return (
        <div style={{
          maxWidth: '400px',
          margin: '50px auto',
          padding: '30px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          backgroundColor: '#f9f9f9'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Login</h2>

          {loginError && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{loginError}</p>}

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <ErrorMessage name="email" component="div" style={{ color: 'red', fontSize: '0.85em', marginTop: '5px' }} />
                </div>

                <div>
                  <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password:</label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <ErrorMessage name="password" component="div" style={{ color: 'red', fontSize: '0.85em', marginTop: '5px' }} />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '1em',
                    fontWeight: 'bold',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  {isSubmitting ? 'Logging In...' : 'Login'}
                </button>
              </Form>
            )}
          </Formik>
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9em', color: '#555' }}>
            Don't have an account? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Register here</Link>
          </p>
        </div>
      );
    }

    export default LoginScreen;
    