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
        .then(category => {
            res.status(201).json({ message: "Category created successfully", category });
        })
        .catch(error => {
            res.status(error.status || 500).json({ message: error.status ? error.message : "Unable to create category" });
        });
}

const updateForm = (req, res) => {
    const id = req.params['id'];
    categoryModel.updateForm(id)
        .then(category => {
            if (category.length === 0) return res.status(404).json({ message: "Category not found" });
            res.status(200).json(category);
        })
        .catch(() => {
            res.status(500).json({ message: "error" });
        });
}

const update = (req, res) => {
    categoryModel.update(req.body)
        .then(updated => {
            if (!updated) return res.status(404).json({ message: "Category not found" });
            res.status(200).json({ message: "Category updated successfully" });
        })
        .catch(error => {
            res.status(error.status || 500).json({ message: error.status ? error.message : "Unable to update category" });
        });
}

module.exports = {
    index,
    store,
    updateForm,
    update
};
