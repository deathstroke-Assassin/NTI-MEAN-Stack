const productModel = require("../models/productModel");

const path = require("path");
const {unlink} = require("fs");

const index = (req, res) => {
    productModel.index(req.user.id)
        .then(products => {
            /* res.render("pages/products/index", { products }); */
            res.json(products);
        });
}

module.exports= {
    index,
}