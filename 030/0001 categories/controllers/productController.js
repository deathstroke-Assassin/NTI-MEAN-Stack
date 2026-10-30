const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const path = require("path");
const {unlink} = require("fs");

const index = (req, res) => {
    productModel.index()
        .then(products => {
            res.render("pages/products/index", { products });
        });
}

const show = (req, res) => {
    const id = req.params['id'];
    productModel.show(id)
        .then(oneProduct => {
            res.render("pages/products/show", { oneProduct });
        });
}

const createForm = (req, res) => {
    categoryModel.index()
        .then(categories => {
            res.render("pages/products/createForm", { categories });
        });
}

const store = (req, res) => {
   // validation
    if(req.file != undefined) {
        req.body.photo = req.file.filename;
    }
    else {
        req.body.photo = "";
    }

   //////////////////
   productModel.store(req.body)
        .then(() => {
            res.redirect("/products");
        });
}

const updateForm = (req, res) => {
    const id = req.params['id'];
    Promise.all([productModel.updateForm(id), categoryModel.index()])
        .then(([oneProduct, categories]) => {
            res.render("pages/products/updateForm", { oneProduct, categories });
        });
}

const update = (req, res) => {
    // validation

    const id = req.body.id;
    productModel.updateForm(id)
        .then(async oneProduct => {
            if(oneProduct.length != 0){
                if(req.file != undefined){
                    if(oneProduct[0].photo != "") {
                        const publicPath = path.resolve("./", "public/img/uploades");
                        unlink(path.join(publicPath, oneProduct[0].photo), (err) => {
                            if(err) {
                                throw err;
                            }
                        });
                    }
                    req.body.photo = req.file.filename;
                }
                else {
                    req.body.photo = oneProduct[0].photo;
                }
                await productModel.update(req.body);
            }
            res.redirect("/products");
        });
}

const destroy = (req, res) => {
    const id = req.params['id'];
    productModel.updateForm(id)
        .then(async oneProduct => {
            if(oneProduct.length != 0){
                if(oneProduct[0].photo != "") {
                    const publicPath = path.resolve("./", "public/img/uploades");
                    unlink(path.join(publicPath, oneProduct[0].photo), (err) => {
                        if(err) {
                            throw err;
                        }
                    });
                }
                await productModel.destroy(id);
            }
            res.redirect("/products");
        });
}

module.exports = {
    index,
    show,
    createForm,
    store,
    updateForm,
    update,
    destroy
};
