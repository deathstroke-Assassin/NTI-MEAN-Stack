const productModel = require("../models/productModelApi");
const path = require("path");
const {unlink} = require("fs");

const index = (req, res) => {
    productModel.index()
        .then(products => {
            res.status(200).json(products);
        })
        .catch(() => {
            res.status(500).json({ message: "error" });
        });
}

const show = (req, res) => {
    const id = req.params['id'];
    productModel.show(id)
        .then(oneProduct => {
            res.status(200).json(oneProduct);
        })
        .catch(() => {
            res.status(500).json({ message: "error" });
        });
}

const store = (req, res) => {
    if(req.file != undefined) {
        req.body.photo = req.file.filename;
    }
    else {
        req.body.photo = "";
    }

    productModel.store(req.body)
        .then(() => {
            res.status(201).json({ message: "Product created successfully" });
        })
        .catch(() => {
            res.status(500).json({ message: "error" });
        });
}

const updateForm = (req, res) => {
    const id = req.params['id'];
    productModel.updateForm(id)
        .then(oneProduct => {
            res.status(200).json(oneProduct);
        })
        .catch(() => {
            res.status(500).json({ message: "error" });
        });
}

const update = (req, res) => {
    const id = req.body.id;

    productModel.updateForm(id)
        .then(async oneProduct => {
            if(oneProduct.length == 0){
                return res.status(404).json({ message: "Product not found" });
            }
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
            res.status(200).json({ message: "Product updated successfully" });
        })
        .catch(err => {
            res.status(500).json({ message: "error" });
        });
}

const destroy = (req, res) => {
    const id = req.params['id'];

    productModel.updateForm(id)
        .then(async oneProduct => {
            if(oneProduct.length == 0){
                return res.status(404).json({ message: "Product not found" });
            }
            if(oneProduct[0].photo != "") {
                const publicPath = path.resolve("./", "public/img/uploades");
                unlink(path.join(publicPath, oneProduct[0].photo), (err) => {
                    if(err) {
                        throw err;
                    }
                });
            }

            await productModel.destroy(id);
            res.status(200).json({ message: "Product destroyed successfully" });
        })
        .catch(err => {
            res.status(500).json({ message: "error" });
        });
}

module.exports = {
    index,
    show,
    store,
    updateForm,
    update,
    destroy
}
