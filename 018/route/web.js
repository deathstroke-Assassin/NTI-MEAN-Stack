const express = require('express');
const webRouter = express.Router();
const staffController = require('../controllers/staffController');

webRouter.get('/', (req, res) => {
    res.render('pages/home');
});

webRouter.get('/staff', (req, res) => {
    webRouter.get('/staff', staffController(req, res));
});


module.exports = webRouter;

