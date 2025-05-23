const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cost = require('../models/cost');

/**
 * @route POST /api/add
 * @desc Add a new cost item
 * @body { description, category, userid, sum, date? }
 * @returns {Object} the new cost item
 */
router.post('/add', async (req, res) => {
    try {
        const { description, category, userid, sum, date } = req.body;
        const cost = new Cost({ description, category, userid, sum, date });
        await cost.save();
        res.json(cost);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @route GET /api/report
 * @desc Get all cost items grouped by category for a given user/month/year
 * @query { id, year, month }
 * @returns {Object} report with grouped costs
 */
router.get('/report', async (req, res) => {
    try {
        const { id, year, month } = req.query;
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);

        const costs = await Cost.find({
            userid: parseInt(id),
            date: { $gte: start, $lte: end }
        });

        const grouped = {
            food: [],
            health: [],
            housing: [],
            sport: [],
            education: []
        };

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

        const costsArray = Object.entries(grouped).map(([k, v]) => ({ [k]: v }));

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
 * @param {string} id
 * @returns {Object} user info + total cost
 */
router.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const allUsers = await User.find({});
        const user = allUsers.find(u => u.id === userId || u.id === parseInt(userId)); // string/number safe match

        if (!user) return res.status(404).json({ error: "User not found" });

        const totalCosts = await Cost.aggregate([
            { $match: { userid: parseInt(userId) } },
            { $group: { _id: null, total: { $sum: "$sum" } } }
        ]);

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
 * @returns {Array} team members with first_name and last_name
 */
router.get('/about', (req, res) => {
    res.json([
        { first_name: "Idan", last_name: "Shany" },
        { first_name: "Teammate", last_name: "Example" }
    ]);
});

module.exports = router;
