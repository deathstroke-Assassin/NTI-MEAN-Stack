
const categoryModel = require('../models/categoryModelApi');
const { ObjectId } = require('mongodb');

const index = async (req, res) => {
    try {
        const categories = await categoryModel.index();
        return res.json(categories);
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return res.status(500).json({
            message: 'Failed to fetch categories'
        });
    }
};

const store = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                message: 'Category name is required'
            });
        }

        const result = await categoryModel.store({
            name,
            description
        });

        return res.status(201).json({
            message: 'Category created successfully',
            id: result.insertedId
        });
    } catch (error) {
        console.error('Failed to create category:', error);
        return res.status(500).json({
            message: 'Failed to create category'
        });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid category ID'
            });
        }

        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                message: 'Category name is required'
            });
        }

        const result = await categoryModel.update(id, {
            name,
            description
        });

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        return res.json({
            message: 'Category updated successfully'
        });
    } catch (error) {
        console.error('Failed to update category:', error);
        return res.status(500).json({
            message: 'Failed to update category'
        });
    }
};

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid category ID'
            });
        }

        const result = await categoryModel.destroy(id);

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        return res.json({
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Failed to delete category:', error);
        return res.status(500).json({
            message: 'Failed to delete category'
        });
    }
};

module.exports = {
    index,
    store,
    update,
    destroy
};
