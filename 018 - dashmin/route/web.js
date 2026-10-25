const express = require('express');
const webRouter = express.Router();
const {StaffController} = require('../controllers/staffController');
const deleteController = require('../controllers/deleteController');
const {allStaffController} = require('../controllers/staffController');
const {StaffEditController} = require('../controllers/staffController');
const {StaffEditControllerPost} = require('../controllers/staffController');

webRouter.get('/', allStaffController);

webRouter.get('/staff/:index', StaffController);
webRouter.get('/staffeditor/:index', StaffEditController);
webRouter.post('/staffeditor/:index', StaffEditControllerPost);
webRouter.get('/delete/:index', deleteController);

module.exports = webRouter;

