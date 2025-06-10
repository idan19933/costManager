

    /**
     * @fileoverview Defines the Mongoose schema for a cost item
     */
    const mongoose = require('mongoose');

/**
 * Mongoose schema for representing a cost (expense) in the database
 *
 * Fields:
 * - description: A short description of the expense
 * - category: The category of the expense. Must be one of:
 *   'food', 'health', 'housing', 'sport', 'education'
 * - userid: The ID of the user who made the expense
 * - sum: The amount of money spent
 * - date: The date the expense occurred. Defaults to the current date
 */
const costSchema = new mongoose.Schema({
    description: { type: String, required: true }, // short description of the expense
    category: { // the type of expense; must be one of the predefined categories

        type: String,
        enum: ['food', 'health', 'housing', 'sport', 'education'],
        required: true
    },
    userid: { type: Number, required: true }, // ID of the user associated with the cost
    sum: { type: Number, required: true }, // the amount of money spent
    date: { type: Date, default: Date.now }   // the date of the expense, defaults to the current date if not provided

});

/**
 * Exports the Cost model based on the costSchema for use in other parts of the application
 */
module.exports = mongoose.model('Cost', costSchema); // export the Cost model to use it in routes or controllers