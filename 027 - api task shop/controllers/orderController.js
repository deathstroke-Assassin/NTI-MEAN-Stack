const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');

const index = async (req, res) => {
    try {
        const orders = await orderModel.index({ date: req.query.date, status: req.query.status });
        res.render('pages/orders/index', { orders, filters: req.query, statuses: orderModel.ORDER_STATUSES });
    } catch (error) {
        res.status(500).send('Unable to load orders. Please try again.');
    }
};

const createForm = async (req, res) => {
    try {
        const products = await productModel.index();
        res.render('pages/orders/createForm', { products, error: req.query.error || '' });
    } catch (error) {
        res.status(500).send('Unable to load products for the order form.');
    }
};

const store = async (req, res) => {
    try {
        await orderModel.create(req.body);
        res.redirect('/orders');
    } catch (error) {
        if (error.status === 400) {
            return res.redirect(`/orders/createForm?error=${encodeURIComponent(error.message)}`);
        }
        res.status(500).send('Unable to save order. Please try again.');
    }
};

const show = async (req, res) => {
    try {
        const order = await orderModel.show(req.params.id);
        if (!order) return res.status(404).send('Order not found.');
        res.render('pages/orders/show', { order, statuses: orderModel.ORDER_STATUSES });
    } catch (error) {
        res.status(500).send('Unable to load order. Please try again.');
    }
};

const updateStatus = async (req, res) => {
    try {
        const updated = await orderModel.updateStatus(req.params.id, req.body.status);
        if (!updated) return res.status(404).send('Order not found.');
        res.redirect(`/orders/show/${req.params.id}`);
    } catch (error) {
        res.status(error.status || 500).send(error.status ? error.message : 'Unable to update order.');
    }
};

module.exports = { index, createForm, store, show, updateStatus };
