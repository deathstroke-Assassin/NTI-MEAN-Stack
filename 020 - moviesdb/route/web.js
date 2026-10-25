const express = require('express');
const webRouter = express.Router();
const app = express();

/* ------------- controllers ------------------- */

const productController = require('../controllers/productController');
const MovieController = require('../controllers/MovieController');

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

/* -------------------movies route roles----------------------- */
webRouter.get('/movies', (req, res) => {
    MovieController.index(req, res);
});

webRouter.get('/movies/search', (req, res) => {
    MovieController.search(req, res);
});

webRouter.get('/movies/categories', (req, res) => {
    MovieController.getAllCategories(req, res);
});
webRouter.get('/movies/categories/:category', (req, res) => {
    MovieController.getCategory(req, res);
});

webRouter.get('/movies/show/:_id', (req, res) => {
    MovieController.show(req, res);
});


// webRouter.get('/products/createForm', (req, res) => {
//     productController.createForm(req, res);
// });

webRouter.post('/movies/store', upload.single('thumbnail'), (req, res) => {
    MovieController.store(req, res);
});

// webRouter.get('/products/show/:id', (req, res) => {
//     productController.show(req, res);
// });

webRouter.get('/movies/destroy/:id', (req, res) => {
    MovieController.destroy(req, res);
});

webRouter.get('/movies/updateForm/:id', (req, res) => {
    MovieController.updateForm(req, res);
});
webRouter.post('/movies/update', upload.single('thumbnail'), (req, res) => {
    MovieController.update(req, res);
});


module.exports = webRouter;