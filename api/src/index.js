require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { setupContainer } = require('./helpers/azureBlobStorage');

const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/auth');
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
