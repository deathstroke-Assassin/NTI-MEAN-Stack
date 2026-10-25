const express = require('express');
const webRouter = express.Router();
const app = express();

/* ------------- controllers ------------------- */

const authController = require("../controllers/authController");

const categoryController = require("../controllers/categoryController");

const productController = require('../controllers/productController');

const productControllerApi = require('../controllers/productControllerApi');
const orderController = require('../controllers/orderController');
const orderControllerApi = require('../controllers/orderControllerApi');
const reportController = require('../controllers/reportController');

/* -------------- parse of form ------------------- */
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const multer = require("multer");

const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/img/uploades/");
    },
    filename: (req, file, cb) => {
        if(file){
            cb(null, Date.now() + path.extname(file.originalname))
        }
    }
});

const upload = multer({
    storage: storage
});

/* -------------- route roles ------------------------ */
webRouter.get('/', (req, res) => {
    homePage.publishedProducts(req, res);
});


webRouter.get('/signin', (req, res) => {
    authController.signin(req, res);
});

webRouter.post('/verifySignin', (req, res) => {
    authController.verifySignin(req, res);
});

webRouter.get('/logout', (req, res) => {
    authController.logout(req, res);
});

/* --------------- API products ---------------------- */
webRouter.get('/api/v1.0/products', (req, res) => {
    productControllerApi.index(req, res);
});

webRouter.post('/api/v1.0/products/store', upload.single('photo'), (req, res) => {
    productControllerApi.store(req, res);
});

webRouter.get('/api/v1.0/products/show/:id', (req, res) => {
    productControllerApi.show(req, res);
});

webRouter.delete('/api/v1.0/products/destroy/:id', (req, res) => {
    productControllerApi.destroy(req, res);
});

webRouter.get('/api/v1.0/products/updateForm/:id', (req, res) => {
    productControllerApi.updateForm(req, res);
});

webRouter.post('/api/v1.0/products/update', upload.single('photo'), (req, res) => {
    productControllerApi.update(req, res);
});


/* ------------------- categories ---------------------- */

webRouter.get('/api/v1.0/categories', (req, res) => {
    categoryController.index(req, res);
});

webRouter.post('/api/v1.0/categories/store', (req, res) => {
    categoryController.store(req, res);
});

webRouter.get('/api/v1.0/categories/updateForm/:id', (req, res) => {
    categoryController.updateForm(req, res);
});

webRouter.post('/api/v1.0/categories/update', (req, res) => {
    categoryController.update(req, res);
});

/* ------------------- API orders and reports ------------------- */
webRouter.get('/api/v1.0/orders', orderControllerApi.index);
webRouter.post('/api/v1.0/orders', orderControllerApi.store);
webRouter.get('/api/v1.0/orders/:id', orderControllerApi.show);
webRouter.patch('/api/v1.0/orders/:id/status', orderControllerApi.updateStatus);

webRouter.get('/api/v1.0/reports/products', reportController.products);
webRouter.get('/api/v1.0/reports/orders', reportController.orders);

/* ------- auth --------- */

/* -------- authorized page ---------------------- */

webRouter.get('/signup',  (req, res) => {
    authController.signup(req, res);
});

webRouter.post('/storeUser', (req, res) => {
    authController.storeUser(req, res);
});

webRouter.get('/dashboard/index', authController.isAdmin, (req, res) => {
    res.render("../views/dashboard/index.ejs");
});


/* -------------------products route roles----------------------- */
webRouter.get('/products', authController.isAdmin, (req, res) => {
    productController.index(req, res);
});

webRouter.get('/products/createForm', authController.isAdmin, (req, res) => {
    productController.createForm(req, res);
});

webRouter.post('/products/store', authController.isAdmin, upload.single('photo'), (req, res) => {
    productController.store(req, res);
});

webRouter.get('/products/show/:id', authController.isAdmin, (req, res) => {
    productController.show(req, res);
});

webRouter.get('/products/destroy/:id', authController.isAdmin, (req, res) => {
    productController.destroy(req, res);
});

webRouter.get('/products/updateForm/:id', authController.isAdmin, (req, res) => {
    productController.updateForm(req, res);
});
webRouter.post('/products/update', authController.isAdmin, upload.single('photo'), (req, res) => {
    productController.update(req, res);
});

/* ------------------- manual order management ------------------- */
const isOrderManager = (req, res, next) => {
    if (['admin', 'editor'].includes(req.session.userRole)) {
        res.locals.fullname = req.session.fullname;
        return next();
    }
    res.redirect('/signin?failed=You are NOT authorized, Signin first.');
};

webRouter.get('/orders', isOrderManager, orderController.index);
webRouter.get('/orders/createForm', isOrderManager, orderController.createForm);
webRouter.post('/orders/store', isOrderManager, orderController.store);
webRouter.get('/orders/show/:id', isOrderManager, orderController.show);
webRouter.post('/orders/:id/status', isOrderManager, orderController.updateStatus);


module.exports = webRouter;
