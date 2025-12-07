// This makes the crypto module available globally, which can resolve issues
// with some libraries (like @azure/storage-blob) that expect it in the global scope.
global.crypto = require('crypto');
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { setupContainer } = require('./helpers/azureBlobStorage');
const session = require('express-session');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CLIENT_URL, 
  credentials: true, // This allows session cookies to be sent and received
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // Don't create session until something is stored
  cookie: {
    httpOnly: true, // Prevents client-side JS from reading the cookie
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 1000 * 60 * 60 * 24 // Expires in 1 day
  }
}));

const authRoutes = require('./routes/authRoutes');
const mediaRoutes = require('./routes/media');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.get('/', (req, res) => {
  res.send('Photo-Share API is running!');
});




const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await setupContainer();
  // Only listen on a port if not in a test environment
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
};

startServer();

module.exports = app; // Export the app for testing
