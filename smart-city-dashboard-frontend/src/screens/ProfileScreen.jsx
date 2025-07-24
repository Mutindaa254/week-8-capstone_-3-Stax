    import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import { useNavigate } from 'react-router-dom';

    // Define your deployed backend API base URL
    const API_BASE_URL = 'https://week-8-capstone_-3-stax.onrender.com/api'; // <--- UPDATED BASE URL

    function ProfileScreen() {
      const [userProfile, setUserProfile] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');
      const navigate = useNavigate();

      useEffect(() => {
        const fetchUserProfile = async () => {
          const token = localStorage.getItem('token');

          if (!token) {
            navigate('/login');
            return;
          }

          try {
            const config = {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            };

            const response = await axios.get(`${API_BASE_URL}/users/profile`, config); // <--- UPDATED URL
            setUserProfile(response.data);
          } catch (err) {
            console.error('Error fetching user profile:', err);
            setError(err.response?.data?.message || 'Failed to fetch profile. Please log in again.');
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }
          } finally {
            setLoading(false);
          }
        };

        fetchUserProfile();
      }, [navigate]);

      if (loading) {
        return (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Loading Profile...</h2>
            <p>Please wait.</p>
          </div>
        );
      }

      if (error) {
        return (
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            <h2>Error Loading Profile</h2>
            <p>{error}</p>
            <p>Please try logging in again.</p>
          </div>
        );
      }

      if (!userProfile) {
        return (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>No User Profile Found</h2>
            <p>Please ensure you are logged in.</p>
          </div>
        );
      }

      return (
        <div style={{
          maxWidth: '600px',
          margin: '50px auto',
          padding: '30px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          backgroundColor: '#f9f9f9',
          textAlign: 'left'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>User Profile</h2>
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ display: 'inline-block', width: '100px' }}>ID:</strong> {userProfile._id}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ display: 'inline-block', width: '100px' }}>Name:</strong> {userProfile.name}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ display: 'inline-block', width: '100px' }}>Email:</strong> {userProfile.email}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ display: 'inline-block', width: '100px' }}>Admin:</strong> {userProfile.isAdmin ? 'Yes' : 'No'}
          </div>
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1em',
                fontWeight: 'bold',
                transition: 'background-color 0.3s ease',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      );
    }

    export default ProfileScreen;
    