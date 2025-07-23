// smart-city-dashboard-backend/utils/generateToken.js

const jwt = require('jsonwebtoken'); // Import jsonwebtoken

// This function will generate a JWT for a given user ID
const generateToken = (id) => {
  // jwt.sign() creates a new token
  // First argument: The payload. This is the data we want to embed in the token.
  //                We'll embed the user's ID.
  // Second argument: The secret key. This is a secret string used to sign the token.
  //                 It must be kept secret and should be loaded from your .env file.
  // Third argument: Options object. 'expiresIn' sets how long the token will be valid.
  //                 '30d' means 30 days.
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

module.exports = generateToken; // Export the function