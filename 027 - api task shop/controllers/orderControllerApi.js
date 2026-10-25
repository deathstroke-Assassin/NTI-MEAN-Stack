const orderModel = require('../models/orderModel');

async function index(req, res) {
    try {
        const orders = await orderModel.index({ date: req.query.date, status: req.query.status });
        res.status(200).json({ count: orders.length, orders });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.status ? error.message : 'Unable to load orders.' });
    }
}

async function show(req, res) {
    try {
        const order = await orderModel.show(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found.' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Unable to load order.' });
    }
}

async function store(req, res) {
    try {
        const order = await orderModel.create(req.body);
        res.status(201).json({ message: 'Order created successfully.', order });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.status ? error.message : 'Unable to create order.' });
    }
}

async function updateStatus(req, res) {
    try {
        const updated = await orderModel.updateStatus(req.params.id, req.body.status);
        if (!updated) return res.status(404).json({ message: 'Order not found.' });
        res.status(200).json({ message: 'Order status updated successfully.' });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.status ? error.message : 'Unable to update order status.' });
    }
}

module.exports = { index, show, store, updateStatus };
