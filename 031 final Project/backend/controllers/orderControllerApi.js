
const orderModel = require('../models/orderModel');

async function index(req, res) {
    try {
        const orders = await orderModel.index();
        return res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({
            message: 'Failed to fetch orders'
        });
    }
}

async function show(req, res) {
    try {
        const order = await orderModel.show(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        return res.status(200).json(order);
    } catch (error) {
        if (error.message === 'Invalid order ID') {
            return res.status(400).json({ message: error.message });
        }

        console.error('Error fetching order:', error);
        return res.status(500).json({
            message: 'Failed to fetch order'
        });
    }
}

async function store(req, res) {
    try {
        const result = await orderModel.store(req.body);

        return res.status(201).json({
            message: 'Order created successfully',
            id: result.insertedId
        });
    } catch (error) {
        const validationErrors = [
            'Customer name, phone, and address are required',
            'An order must contain at least one item',
            'Invalid item ID',
            'Item quantity must be a positive integer',
            'An item was not found or is unavailable'
        ];

        if (
            validationErrors.includes(error.message) ||
            error.message.startsWith('Insufficient stock for ')
        ) {
            return res.status(400).json({
                message: error.message
            });
        }

        console.error('Error creating order:', error);
        return res.status(500).json({
            message: 'Failed to create order'
        });
    }
}

async function update(req, res) {
    try {
        const result = await orderModel.update(
            req.params.id,
            req.body
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        return res.status(200).json({
            message: 'Order updated successfully'
        });
    } catch (error) {
        const validationErrors = [
            'Invalid order ID',
            'Status must be opened or closed',
            'Notes must be text',
            'No order changes provided'
        ];

        if (validationErrors.includes(error.message)) {
            return res.status(400).json({
                message: error.message
            });
        }

        console.error('Error updating order:', error);
        return res.status(500).json({
            message: 'Failed to update order'
        });
    }
}

module.exports = { index, show, store, update };
