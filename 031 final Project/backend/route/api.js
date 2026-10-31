const express = require("express");
const apiRouter = express.Router();
const app = express();

/* ------------- controllers ------------------- */

const itemController = require("../controllers/itemControllerApi");
const authControllerApi = require("../controllers/authControllerApi");
const categoryControllerApi = require("../controllers/categoryControllerApi");
const orderController = require('../controllers/orderControllerApi');
/* -------------- parse of form ------------------- */
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/uploades/");
  },
  filename: (req, file, cb) => {
    if (file) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  },
});

const upload = multer({
  storage: storage,
});

/* -------------- route roles ------------------------ */
//////////////////////////

apiRouter.post("/signin", (req, res) => {
  authControllerApi.signin(req, res);
});
/* -------------- categories ------------------------ */
apiRouter.get("/categories", categoryControllerApi.index);

/* -------------- items ------------------------ */

apiRouter.get('/items', itemController.index);
apiRouter.get('/items/:id', itemController.show);

/* -------------- orders ------------------------ */

apiRouter.post('/orders', orderController.store);

//////////////////////////
/* -------------- Protected routes ------------------------ */
//////////////////////////
apiRouter.use(authControllerApi.verifySignin);

apiRouter.get("/dashboard", (req, res) => {
  authControllerApi.dashboard(req, res);
});

/* -------------- categories ------------------------ */

apiRouter.post("/categories", categoryControllerApi.store);
apiRouter.put("/categories/:id", categoryControllerApi.update);
apiRouter.delete("/categories/:id", categoryControllerApi.destroy);

/* ------------- Item management ------------------- */
apiRouter.post('/items', upload.single('photo'),
    (req, res, next) => {
        if (req.file) {
            req.body.photo = req.file.filename;
        }
        next();
    },
    itemController.store
);

apiRouter.put('/items/:id', upload.single('photo'),
    (req, res, next) => {
        if (req.file) {
            req.body.photo = req.file.filename;
        }
        next();
    },
    itemController.update
);

apiRouter.delete('/items/:id', itemController.destroy);

/* -------------- orders ------------------------ */
apiRouter.get('/orders', orderController.index);
apiRouter.get('/orders/:id', orderController.show);
apiRouter.put('/orders/:id', orderController.update);


module.exports = apiRouter;
