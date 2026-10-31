
const itemModel = require('../models/itemModel');
const { ObjectId } = require('mongodb');


// MANAGER: Get all items, including quantities and inactive items.
const index = async (req, res) => {
    try {
        const items = await itemModel.index();
        return res.status(200).json(items);
    } catch (error) {
        console.error('Failed to fetch items:', error);
        return res.status(500).json({
            message: 'Failed to fetch items'
        });
    }
};

// MANAGER: Get one item for editing.
const show = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid item ID'
            });
        }

        const items = await itemModel.show(id);

        if (items.length === 0) {
            return res.status(404).json({
                message: 'Item not found'
            });
        }

        return res.status(200).json(items[0]);
    } catch (error) {
        console.error('Failed to fetch item:', error);
        return res.status(500).json({
            message: 'Failed to fetch item'
        });
    }
};

// MANAGER: Create an item.
const store = async (req, res) => {
    try {
        const result = await itemModel.store(req.body);

        return res.status(201).json({
            message: 'Item created successfully',
            id: result.insertedId
        });
    } catch (error) {
        console.error('Failed to create item:', error);

        if (
            error.message === 'Item name is required' ||
            error.message === 'A valid category ID is required' ||
            error.message === 'Price must be a valid non-negative number' ||
            error.message === 'Quantity must be a non-negative integer' ||
            error.message === 'Description must be text'
        ) {
            return res.status(400).json({
                message: error.message
            });
        }

        if (error.message === 'Category not found') {
            return res.status(400).json({
                message: 'The selected category does not exist'
            });
        }

        return res.status(500).json({
            message: 'Failed to create item'
        });
    }
};

// MANAGER: Update an item.
const update = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid item ID'
            });
        }

        const result = await itemModel.update({
            ...req.body,
            id
        });

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: 'Item not found'
            });
        }

        return res.status(200).json({
            message: 'Item updated successfully'
        });
    } catch (error) {
        console.error('Failed to update item:', error);

        if (
            error.message === 'Item name is required' ||
            error.message === 'A valid category ID is required' ||
            error.message === 'Price must be a valid non-negative number' ||
            error.message === 'Quantity must be a non-negative integer' ||
            error.message === 'Description must be text' ||
            error.message === 'isActive must be true or false'
        ) {
            return res.status(400).json({
                message: error.message
            });
        }

        if (error.message === 'Category not found') {
            return res.status(400).json({
                message: 'The selected category does not exist'
            });
        }

        return res.status(500).json({
            message: 'Failed to update item'
        });
    }
};

// MANAGER: Delete an item.
const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid item ID'
            });
        }

        const result = await itemModel.destroy(id);

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'Item not found'
            });
        }

        return res.status(200).json({
            message: 'Item deleted successfully'
        });
    } catch (error) {
        console.error('Failed to delete item:', error);
        return res.status(500).json({
            message: 'Failed to delete item'
        });
    }
};

module.exports = {
    index,
    show,
    store,
    update,
    destroy
};
