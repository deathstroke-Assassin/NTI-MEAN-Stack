const categoryModel = require("../models/categoryModel");

const index = (req, res) => {
    categoryModel.index()
        .then(categories => {
            res.status(200).json(categories);
        })
        .catch(() => {
            res.status(500).json({ message: "error" });
        });
}

const store = (req, res) => {
    categoryModel.store(req.body)
        .then(() => {
            res.status(201).json({ message: "Category created successfully" });
        })
        .catch(() => {
            res.status(500).json({ message: "error" });
        });
}

const updateForm = (req, res) => {
    const id = req.params['id'];
    categoryModel.updateForm(id)
        .then(category => {
            res.status(200).json(category);
        })
        .catch(() => {
            res.status(500).json({ message: "error" });
        });
}

const update = (req, res) => {
    categoryModel.update(req.body)
        .then(() => {
            res.status(200).json({ message: "Category updated successfully" });
        })
        .catch(() => {
            res.status(500).json({ message: "error" });
        });
}

module.exports = {
    index,
    store,
    updateForm,
    update
};
