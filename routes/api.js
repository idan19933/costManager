

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cost = require('../models/cost');

/**
 * @route POST /api/add
 * @desc Add a new cost item
 * @param {Object} req.body - Request body
 * @param {string} req.body.description - Description of the cost
 * @param {string} req.body.category - Category of the cost
 * @param {string|number} req.body.userid - User ID
 * @param {number} req.body.sum - Sum of the cost
 * @param {string} [req.body.date] - Date of the cost (optional, ISO string)
 * @returns {Object} The newly created cost item
 */
router.post('/add', async (req, res) => {
    try {
        const { description, category, userid, sum, date } = req.body;
        const cost = new Cost({ description, category, userid, sum, date });  // create a new cost document
        await cost.save();    // save to database
        res.json(cost);      // return the saved cost
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @route GET /api/report
 * @desc Get all cost items grouped by category for a given user/month/year
 * @param {string|number} req.query.id - User ID
 * @param {number} req.query.year - Year (e.g., 2025)
 * @param {number} req.query.month - Month (1-12)
 * @returns {Object} Report with costs grouped by category
 */
router.get('/report', async (req, res) => {
    try {
        const { id, year, month } = req.query;
        const start = new Date(year, month - 1, 1);  // define start and end of the month
        const end = new Date(year, month, 0, 23, 59, 59);

        const costs = await Cost.find({      // fetch relevant costs
            userid: parseInt(id),
            date: { $gte: start, $lte: end }
        });

        const grouped = { // initialize grouped result
            food: [],
            health: [],
            housing: [],
            sport: [],
            education: []
        };

        // group costs by category
        costs.forEach(cost => {
            const day = new Date(cost.date).getDate();
            if (grouped[cost.category]) {
                grouped[cost.category].push({
                    sum: cost.sum,
                    description: cost.description,
                    day
                });
            }
        });

        // convert grouped object to array format
        const costsArray = Object.entries(grouped).map(([k, v]) => ({ [k]: v }));

        // return the report
        res.json({
            userid: parseInt(id),
            year: parseInt(year),
            month: parseInt(month),
            costs: costsArray
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @route GET /api/users/:id
 * @desc Get user info and total cost sum
 * @param {string} req.params.id - User ID
 * @returns {Object} User info and total cost sum
 */
router.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const allUsers = await User.find({});    // fetch all users and find the matching one
        const user = allUsers.find(u => u.id === userId || u.id === parseInt(userId)); // string/number safe match

        if (!user) return res.status(404).json({ error: "User not found" });

        // aggregate total sum of user's costs
        const totalCosts = await Cost.aggregate([
            { $match: { userid: parseInt(userId) } },
            { $group: { _id: null, total: { $sum: "$sum" } } }
        ]);

        // return user info with total cost
        res.json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            total: totalCosts[0]?.total || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route GET /api/about
 * @desc Returns the list of developer team members
 * @returns {Array<Object>} List of team members with first_name and last_name
 */
router.get('/about', (req, res) => {
    res.json([
        { first_name: "Idan", last_name: "Shany" },
        { first_name: "Omer", last_name: "Keren Zvi" }
    ]);
});

module.exports = router;