// smart-city-dashboard-backend/models/User.js

const mongoose = require('mongoose'); // Import Mongoose to define the schema
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing

// Define the User Schema
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Name is a required field
    },
    email: {
      type: String,
      required: true,
      unique: true, // Email must be unique for each user
      lowercase: true, // Store emails in lowercase to ensure uniqueness
    },
    password: {
      type: String,
      required: true, // Password is a required field
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false, // Default value is false (most users are not admins)
    },
  },
  {
    timestamps: true, // Mongoose will automatically add createdAt and updatedAt fields
  }
);

// Middleware to hash password before saving (pre-save hook)
// 'pre' hook runs before a document is saved to the database
userSchema.pre('save', async function (next) {
  // Check if the password field is modified. If not, move to the next middleware/save operation.
  // This prevents re-hashing an already hashed password if a user updates other info.
  if (!this.isModified('password')) {
    next();
  }

  // Generate a salt (random string) to combine with the password before hashing
  // A higher 'saltRounds' value means more secure, but slower hashing. 10 is a common value.
  const salt = await bcrypt.genSalt(10);
  // Hash the password using the generated salt
  this.password = await bcrypt.hash(this.password, salt);
  next(); // Move to the next middleware/save operation
});

// Method to compare entered password with the hashed password in the database
// This is an instance method, available on user documents (e.g., user.matchPassword('plainTextPass'))
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Use bcrypt.compare to compare the plain text password with the hashed password
  return await bcrypt.compare(enteredPassword, this.password);
};


// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User; // Export the User model for use in other parts of the application