  import React, { useState } from 'react';
    import { Formik, Form, Field, ErrorMessage } from 'formik';
    import * as Yup from 'yup';
    import axios from 'axios';
    import { Link, useNavigate } from 'react-router-dom';

    function RegisterScreen() {
      const navigate = useNavigate();
      const [registerError, setRegisterError] = useState('');
      const [registerSuccess, setRegisterSuccess] = useState('');

      // Define validation schema using Yup
      const RegisterSchema = Yup.object().shape({
        username: Yup.string() // Keep 'username' for frontend display/validation
          .min(3, 'Username must be at least 3 characters')
          .max(50, 'Username must not exceed 50 characters')
          .required('Username is required'),
        email: Yup.string()
          .email('Invalid email address')
          .required('Email is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Confirm Password is required'),
      });

      // Handle form submission
      const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setRegisterError(''); // Clear previous errors
        setRegisterSuccess(''); // Clear previous success messages
        try {
          // IMPORTANT: Sending 'name' instead of 'username' to match backend schema
          const response = await axios.post('http://localhost:5000/api/users', {
            name: values.username, // <-- CHANGED: Send 'name' from frontend's 'username' field
            email: values.email,
            password: values.password,
          });

          setRegisterSuccess(response.data.message || 'Registration successful! Please log in.');
          console.log('Registration successful:', response.data);

          resetForm(); // Clear form fields
          navigate('/login'); 

        } catch (error) {
          console.error('Registration error:', error.response ? error.response.data : error.message);
          setRegisterError(error.response?.data?.message || 'Registration failed. Please try again.');
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
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Register</h2>
          
          {registerError && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{registerError}</p>}
          {registerSuccess && <p style={{ color: 'green', textAlign: 'center', marginBottom: '15px' }}>{registerSuccess}</p>}

          <Formik
            initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Username:</label>
                  <Field 
                    type="text" 
                    id="username" 
                    name="username" 
                    placeholder="Choose a username" 
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #ccc', 
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }} 
                  />
                  <ErrorMessage name="username" component="div" style={{ color: 'red', fontSize: '0.85em', marginTop: '5px' }} />
                </div>

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

                <div>
                  <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Confirm Password:</label>
                  <Field 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    placeholder="Confirm your password" 
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #ccc', 
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }} 
                  />
                  <ErrorMessage name="confirmPassword" component="div" style={{ color: 'red', fontSize: '0.85em', marginTop: '5px' }} />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '1em',
                    fontWeight: 'bold',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  {isSubmitting ? 'Registering...' : 'Register'}
                </button>
              </Form>
            )}
          </Formik>
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9em', color: '#555' }}>
            Already have an account? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Login here</Link>
          </p>
        </div>
      );
    }

    export default RegisterScreen;
    