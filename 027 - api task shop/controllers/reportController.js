const reportModel = require('../models/reportModel');

async function products(req, res) {
    try {
        res.status(200).json(await reportModel.productsByCategory(req.query.categoryId));
    } catch (error) {
        res.status(error.status || 500).json({ message: error.status ? error.message : 'Unable to generate product report.' });
    }
}

async function orders(req, res) {
    try {
        res.status(200).json(await reportModel.orders({ date: req.query.date, status: req.query.status }));
    } catch (error) {
        res.status(error.status || 500).json({ message: error.status ? error.message : 'Unable to generate order report.' });
    }
}

module.exports = { products, orders };
