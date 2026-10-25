const express = require('express')
const app = express();
const path = require('path')
require('dotenv').config();

// public
app.use(express.static(path.join(__dirname, 'public')))
// app.use(express.static(__dirname + 'public'));

// view engine
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// router
const webRouter = require('./route/web')
app.use(webRouter)


// start server
const port = process.env.PORT
app.listen(port ,()=> {
    console.log("port is "+ port);
})