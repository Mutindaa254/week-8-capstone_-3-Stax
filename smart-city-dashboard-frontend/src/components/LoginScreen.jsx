import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function LoginScreen() {
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  // Define validation schema using Yup
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoginError(''); // Clear previous errors
    setLoginSuccess(''); // Clear previous success messages
    try {
      // IMPORTANT: Replace with your actual backend login endpoint
      // This assumes your backend is running on http://localhost:5000
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email: values.email,
        password: values.password,
      });

      // Assuming your backend sends a success message or user data upon successful login
      setLoginSuccess(response.data.message || 'Login successful!');
      console.log('Login successful:', response.data);

      // Store token or user info (e.g., in localStorage) - for actual app
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to home page or dashboard after successful login
      navigate('/'); 

      resetForm(); // Clear form fields
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      setLoginError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false); // Enable the submit button again
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
      {loginSuccess && <p style={{ color: 'green', textAlign: 'center', marginBottom: '15px' }}>{loginSuccess}</p>}

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
              {isSubmitting ? 'Logging in...' : 'Login'}
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