const express = require('express');
const webRouter = express.Router();
const app = express();

/* ------------- controllers ------------------- */

const productController = require('../controllers/productController');
const productControllerApi = require('../controllers/productControllerApi');

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

/* -------------------products route roles----------------------- */
webRouter.get('/products', (req, res) => {
    productController.index(req, res);
});

webRouter.get('/products/createForm', (req, res) => {
    productController.createForm(req, res);
});

webRouter.post('/products/store', upload.single('photo'), (req, res) => {
    productController.store(req, res);
});

webRouter.get('/products/show/:id', (req, res) => {
    productController.show(req, res);
});

webRouter.get('/products/destroy/:id', (req, res) => {
    productController.destroy(req, res);
});

webRouter.get('/products/updateForm/:id', (req, res) => {
    productController.updateForm(req, res);
});
webRouter.post('/products/update', upload.single('photo'), (req, res) => {
    productController.update(req, res);
});



// 


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


module.exports = webRouter;