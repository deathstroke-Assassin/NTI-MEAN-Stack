const productModel = require("../models/productModelApi");
const path = require("path");
const { unlink } = require("fs/promises");

async function removePhoto(filename) {
    if (!filename) return;
    const photoPath = path.join(process.cwd(), "public/img/uploades", path.basename(filename));
    await unlink(photoPath).catch(() => {});
}

const index = (req, res) => {
    productModel.index()
        .then(products => {
            res.status(200).json(products);
        })
        .catch(error => {
            res.status(500).json({ message: "Unable to load products" });
        });
}

const show = (req, res) => {
    const id = req.params['id'];
    productModel.show(id)
        .then(oneProduct => {
            if (oneProduct.length === 0) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.status(200).json(oneProduct[0]);
        })
        .catch(() => {
            res.status(500).json({ message: "error" });
        });
}

const store = (req, res) => {
    if (req.file) req.body.photo = req.file.filename;
    else req.body.photo = "";

    productModel.store(req.body)
        .then(product => {
            res.status(201).json({ message: "Product created successfully", product });
        })
        .catch(error => {
            const status = error.status || 500;
            res.status(status).json({ message: status === 500 ? "Unable to create product" : error.message });
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
            req.body.photo = req.file ? req.file.filename : oneProduct[0].photo;

            const updated = await productModel.update(req.body);
            if (!updated) return res.status(404).json({ message: "Product not found" });
            if (req.file) await removePhoto(oneProduct[0].photo);
            res.status(200).json({ message: "Product updated successfully" });
        })
        .catch(error => {
            res.status(error.status || 500).json({ message: error.status ? error.message : "Unable to update product" });
        });
}

const destroy = (req, res) => {
    const id = req.params['id'];

    productModel.updateForm(id)
        .then(async products => {
            if (products.length === 0) return res.status(404).json({ message: "Product not found" });
            const deleted = await productModel.destroy(id);
            if (!deleted) return res.status(404).json({ message: "Product not found" });
            await removePhoto(products[0].photo);
            res.status(200).json({ message: "Product destroyed successfully" });
        })
        .catch(error => {
            res.status(500).json({ message: "Unable to delete product" });
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
