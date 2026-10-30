const express = require('express');
const apiRouter = express.Router();
const app = express();

/* ------------- controllers ------------------- */

const productControllerApi = require('../controllers/productControllerApi');
const authControllerApi = require('../controllers/authControllerApi')
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


apiRouter.post("/signin", (req,res)=>{
    authControllerApi.signin(req,res);
})


/* -------------- Protected routes ------------------------ */
//////////////////////////
apiRouter.use(authControllerApi.verifySignin)


apiRouter.get('/dashboard', (req, res) => {
    authControllerApi.dashboard(req, res);
});
module.exports = apiRouter;