const productmodel = require('../models/productModel.js')
const path = require("path");
const { unlink } = require('fs')

const index = (req,res)=> {
    productmodel.index()
        .then(products => {
            res.render('pages/products/index', {products})
        })
}


const createForm = (req,res) =>{
    res.render('pages/products/createForm')
}

const store = (req, res) => {
    // validation
    if (req.file != undefined) {
        req.body.photo = req.file.filename;
    }
    else {
        req.body.photo = "";
    }

    //////////////////
    productModel.store(req.body)
        .then(error => {
            //
        });
    res.redirect("/products");
}



module.exports = {
    index,
    createForm,
    store,
}