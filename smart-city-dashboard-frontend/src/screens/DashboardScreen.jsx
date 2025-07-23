import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client'; // Import socket.io-client

function DashboardScreen() {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    // Initialize Socket.io connection
    // IMPORTANT: Ensure this URL matches your backend Socket.io server URL
    const socket = io('http://localhost:5000', {
      auth: {
        token: token // You might send the token for authentication if your Socket.io server requires it
      }
    });

    socket.on('connect', () => {
      console.log('Connected to Socket.io server');
    });

    socket.on('message', (msg) => {
      console.log('Message from Socket.io server:', msg);
    });

    // Listen for 'newSensorData' event
    socket.on('newSensorData', (newData) => {
      console.log('Received new sensor data via Socket.io:', newData);
      // Add the new data to the beginning of the array for real-time display
      setSensorData((prevData) => [newData, ...prevData]);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.io connection error:', err.message);
      // Handle authentication errors for socket.io if needed
      if (err.message === 'Authentication error') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    });

    // Fetch initial sensor data when component mounts
    const fetchInitialSensorData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sensors', config);
        setSensorData(response.data);
      } catch (err) {
        console.error('Error fetching initial sensor data:', err);
        setError(err.response?.data?.message || 'Failed to fetch initial sensor data.');
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialSensorData();

    // Clean up socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [navigate]); // Add navigate to dependency array

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Loading Dashboard Data...</h2>
        <p>Please wait.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '20px auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Smart City Live Data</h2>
      {sensorData.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '1.2em', color: '#555' }}>No sensor data available. Try importing data via the backend seeder.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {sensorData.map((data) => (
            <div
              key={data._id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <h3 style={{ margin: '0 0 10px', color: '#007bff' }}>{data.type}</h3>
              <p style={{ fontSize: '1.8em', fontWeight: 'bold', margin: '5px 0' }}>
                {data.value} {data.unit}
              </p>
              <p style={{ fontSize: '0.9em', color: '#777', margin: '5px 0' }}>Location: {data.location}</p>
              <p style={{ fontSize: '0.8em', color: '#999', margin: '5px 0' }}>
                Last Updated: {new Date(data.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardScreen;
