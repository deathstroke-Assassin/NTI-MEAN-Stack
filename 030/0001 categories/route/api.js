const express = require('express');
const apiRouter = express.Router();
const app = express();

/* ------------- controllers ------------------- */

const productControllerApi = require('../controllers/productControllerApi');
const authControllerApi = require('../controllers/authControllerApi');

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
//////////////////////////
apiRouter.post('/signin', (req, res) => {
    authControllerApi.signin(req, res);
});

apiRouter.post('/signup', (req, res) => {
    authControllerApi.signup(req, res);
});
///////////////////////
apiRouter.use(authControllerApi.verifySignin);

/* -------------------products route roles----------------------- */
apiRouter.get('/products', (req, res) => {
    productControllerApi.index(req, res);
});
apiRouter.get('/myProducts', (req, res) => {
    productControllerApi.myProducts(req, res);
});
apiRouter.get('/products/show/:id', (req, res) => {
    productControllerApi.show(req, res);
});
/* apiRouter.get('/products/createForm', (req, res) => {
    productControllerApi.createForm(req, res);
}); */

/* ---****---- */
apiRouter.post('/products/store', upload.single('photo'), (req, res) => {
    productControllerApi.store(req, res);
});

apiRouter.get('/products/updateForm/:id', (req, res) => {
    productControllerApi.updateForm(req, res);
});
apiRouter.put('/products/update', upload.single('photo'), (req, res) => {
    productControllerApi.update(req, res);
});
apiRouter.delete('/products/destroy/:id', (req, res) => {
    productControllerApi.destroy(req, res);
});
// add more route roles


module.exports = apiRouter;