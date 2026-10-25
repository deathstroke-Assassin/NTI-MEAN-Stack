const express = require('express');
const webRouter = express.Router();
const app = express();

/* ------------- controllers ------------------- */

const authController = require("../controllers/authController");

const productController = require('../controllers/productController');
const userController = require('../controllers/userController');

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

webRouter.get('/signin', (req, res) => {
    authController.signin(req, res);
});

webRouter.post('/verifySignin', (req, res) => {
    authController.verifySignin(req, res);
});

webRouter.get('/logout', (req, res) => {
    authController.logout(req, res);
});

webRouter.get('/', (req, res) => {
    productController.acceptedProducts(req, res);
});



/* ------- auth --------- */
webRouter.use(authController.isAuth);


/* -------- authorized page ---------------------- */

webRouter.get('/dashboard/index', authController.isAdmin,(req, res) => {
    res.render("../views/dashboard/index.ejs");
});

/*
        adding Users Admin AND Editor
*/


webRouter.get('/signup/:role', (req, res) => {
     if (req.session.userRole !== "admin") {
        return res.redirect("/");
    }

    req.session.signupRole = req.params.role;
    authController.signup(req, res);

});

webRouter.post('/storeUser', (req, res) => {
    authController.storeUser(req, res, req.session.signupRole);
});
// webRouter.post('/storeAdmin', (req, res) => {
//     authController.storeUser(req, res, "admin");
// });


// /* ------- Editor --------- */

/* -------------------products route roles----------------------- */
webRouter.get('/products', authController.isEditor, (req, res) => {
    productController.index(req, res);
});

webRouter.get('/products/createForm', authController.isEditor, (req, res) => {
    productController.createForm(req, res);
});

webRouter.post('/products/store', authController.isEditor, upload.single('photo'), (req, res) => {
    productController.store(req, res);
});

webRouter.get('/products/show/:id', authController.isEditor, (req, res) => {
    productController.show(req, res);
});

webRouter.get('/products/markdelete/:id', authController.isEditor, (req, res) => {
    productController.markdelete(req, res);
});

webRouter.get('/products/updateForm/:id', authController.isEditor, (req, res) => {
    productController.updateForm(req, res);
});
webRouter.post('/products/update', authController.isEditor, upload.single('photo'), (req, res) => {
    productController.update(req, res);
});

/*========  Admin  =============*/ 

/* -------------------users route roles----------------------- */
webRouter.get('/users', authController.isAdmin, (req, res) => {
    userController.index(req, res);
});

webRouter.get('/users/show/:id', authController.isAdmin, (req, res) => {
    userController.show(req, res);
});

webRouter.get('/users/destroy/:id', authController.isAdmin, (req, res) => {
    userController.destroy(req, res);
});

webRouter.get('/users/updateForm/:id', authController.isAdmin, (req, res) => {
    userController.updateForm(req, res);
});
webRouter.post('/users/update', authController.isAdmin, (req, res) => {
    userController.update(req, res);
});


webRouter.get('/dashboard/productAproval',authController.isAdmin, (req, res) => {
    productController.pendingProducts(req, res);
});

webRouter.get('/dashboard/productAproval/accept/:id',authController.isAdmin, (req, res) => {
    productController.productsAccept(req, res);
});
webRouter.get('/dashboard/productAproval/update/:id',authController.isAdmin, (req, res) => {
    productController.productsAcceptUpdate(req, res);
});

webRouter.get('/dashboard/productAproval/rejectupdate/:id',authController.isAdmin, (req, res) => {
    productController.productsRejectUpdate(req, res);
});

webRouter.get('/dashboard/productAproval/rejectdelete/:id',authController.isAdmin, (req, res) => {
    productController.productsRejectDelete(req, res);
});


webRouter.get('/products/destroy/:id', authController.isAdmin, (req, res) => {
    productController.destroy(req, res);
});

module.exports = webRouter;