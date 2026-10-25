const express = require('express');
const webRouter = express.Router();
const app = express();

/* ------------- controllers ------------------- */

const authController = require("../controllers/authController");

const roomController = require('../controllers/roomController');
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
    roomController.acceptedrooms(req, res);
});



/* ------- auth --------- */
// webRouter.use(authController.isAuth);


/* -------- authorized page ---------------------- */

webRouter.get('/dashboard/index', (req, res) => {
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

/* -------------------rooms route roles----------------------- */
webRouter.get('/rooms', (req, res) => {
    roomController.index(req, res);
});

webRouter.get('/rooms/createForm', authController.isEditor, (req, res) => {
    roomController.createForm(req, res);
});

webRouter.post('/rooms/store', authController.isEditor, upload.single('photo'), (req, res) => {
    roomController.store(req, res);
});

webRouter.get('/rooms/:id',  (req, res) => {
    roomController.show(req, res);
});
// ===================

webRouter.get("/reservations", (req, res)=> {
    roomController.reservationFilter(req, res)
})
webRouter.get("/reservations/create", (req, res)=> {
    roomController.reservationCreate(req, res)
})
webRouter.post("/reservations/store", (req, res)=> {
    roomController.store(req, res)
})


webRouter.post(
    "/rooms/:id/reservations/:reservationIndex/status",
    (req, res) => roomController.updateReservationStatus(req, res)
);

// ===================
webRouter.get('/rooms/markdelete/:id', authController.isEditor, (req, res) => {
    roomController.markdelete(req, res);
});
webRouter.get('/rooms/updateForm/:id', authController.isEditor, (req, res) => {
    roomController.updateForm(req, res);
});
webRouter.post('/rooms/update', authController.isEditor, upload.single('photo'), (req, res) => {
    roomController.update(req, res);
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


webRouter.get('/dashboard/roomAproval',authController.isAdmin, (req, res) => {
    roomController.pendingrooms(req, res);
});

webRouter.get('/dashboard/roomAproval/accept/:id',authController.isAdmin, (req, res) => {
    roomController.roomsAccept(req, res);
});
webRouter.get('/dashboard/roomAproval/update/:id',authController.isAdmin, (req, res) => {
    roomController.roomsAcceptUpdate(req, res);
});

webRouter.get('/dashboard/roomAproval/rejectupdate/:id',authController.isAdmin, (req, res) => {
    roomController.roomsRejectUpdate(req, res);
});

webRouter.get('/dashboard/roomAproval/rejectdelete/:id',authController.isAdmin, (req, res) => {
    roomController.roomsRejectDelete(req, res);
});


webRouter.get('/rooms/destroy/:id', authController.isAdmin, (req, res) => {
    roomController.destroy(req, res);
});

module.exports = webRouter;