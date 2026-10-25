const { MongoClient, ObjectId, mongoConnection } = require('./mongodbConnection');
const orderModel = require('./orderModel');

async function withDb(callback) {
    const client = await MongoClient.connect(mongoConnection);
    try {
        return await callback(client.db());
    } finally {
        await client.close();
    }
}

async function productsByCategory(categoryId) {
    if (categoryId && !ObjectId.isValid(categoryId)) {
        throw Object.assign(new Error('A valid categoryId is required.'), { status: 400 });
    }
    return withDb(async db => {
        const category = categoryId ? await db.collection('categories').findOne({ _id: new ObjectId(String(categoryId)) }) : null;
        if (categoryId && !category) throw Object.assign(new Error('Category not found.'), { status: 404 });
        const match = categoryId ? { categoryId: new ObjectId(String(categoryId)) } : {};
        const products = await db.collection('products').aggregate([
            { $match: match },
            { $lookup: { from: 'categories', localField: 'categoryId', foreignField: '_id', as: 'category' } },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
            { $project: { name: 1, price: 1, photo: 1, categoryId: 1, categoryName: '$category.name' } },
            { $sort: { categoryName: 1, name: 1 } }
        ]).toArray();
        return { category: category ? { _id: category._id, name: category.name } : null, count: products.length, products };
    });
}

async function orders(filters = {}) {
    const matchingOrders = await orderModel.index(filters);
    return {
        filters: { date: filters.date || null, status: filters.status || null },
        count: matchingOrders.length,
        orderCount: matchingOrders.length,
        totalRevenue: Number(matchingOrders.reduce((sum, order) => sum + Number(order.total ?? order.products?.reduce((lineSum, line) => lineSum + Number(line.quantity) * Number(line.piecePrice), 0) ?? 0), 0).toFixed(2)),
        orders: matchingOrders
    };
}

module.exports = { productsByCategory, orders };
