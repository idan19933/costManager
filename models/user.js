

const mongoose = require('mongoose');

/**
 * User schema definition for MongoDB collection
 * @typedef {Object} User
 * @property {string} id - Unique user identifier
 * @property {string} first_name - User's first name
 * @property {string} last_name - User's last name
 * @property {Date} birthday - User's birth date
 * @property {string} marital_status - User's marital status
 */
const userSchema = new mongoose.Schema(
    {
            id: { type: String, required: true, index: true, unique: true },
            first_name: { type: String, required: true }, // user's first name
            last_name: { type: String, required: true }, // user's last name
            birthday: { type: Date, required: true }, // user's birthday
            marital_status: { type: String, required: true }, // user's marital status
    }
);

/**
 * Exports the User model for use in the application
 * @module User
 */
module.exports = mongoose.model('User', userSchema); // export the User model for use in the application