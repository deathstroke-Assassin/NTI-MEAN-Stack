const express = require('express');
const webRouter = express.Router();
const app = express();
const productController = require('../controllers/productController')

// form parsing
app.use(express.json())
app.use(express.urlencoded(
    { extended: true }
))
const multer = require('multer')
const path = require('path')
//==============
//routes
webRouter.get('/products',(req,res)=>{
    productController.index(req,res)
})
webRouter.get('/products/createForm',(req,res)=>{
    productController.createForm(req,res)
})
webRouter.post('/products/store',(req,res)=>{
    productController.store(req,res)
})

module.exports = webRouter;
