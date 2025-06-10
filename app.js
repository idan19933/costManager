
/**
 * loads environment variables from .env file into process.env
 */
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const apiRoutes = require('./routes/api');

app.use(cors());
app.use(express.json());

/**
 * connects to MongoDB using MONGO_URI from environment variables
 */
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error:', err)); // logs success or error message upon DB connection attempt

/**
 * mounts all API routes under the '/api' base path
 */
app.use('/api', apiRoutes); // mounts all API routes under the '/api' base path

/**
 * port number used by the server
 * @type {number}
 */
const PORT = process.env.PORT || 3000; // sets the server port from environment or defaults to 3000

/**
 * starts the server on the specified port and logs the URL
 */
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
// starts the server and logs the URL to the console

/**
 * exports the Express app instance for testing
 */
module.exports = app; // exports the app for testing