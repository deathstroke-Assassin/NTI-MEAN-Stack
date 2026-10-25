const { MongoClient, ObjectId, mongoConnection } = require('./mongodbConnection');

function idMatch(id) {
    if (!ObjectId.isValid(id)) return { _id: String(id) };
    return { $or: [{ _id: new ObjectId(String(id)) }, { _id: String(id) }] };
}

async function withProductsCollection(callback) {
    const client = await MongoClient.connect(mongoConnection);
    try {
        return await callback(client.db().collection('products'), client.db());
    } finally {
        await client.close();
    }
}

async function index() {
    return withProductsCollection(products => products.aggregate([
        {
            $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'category'
            }
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        { $project: { name: 1, price: 1, photo: 1, categoryId: 1, categoryName: '$category.name' } }
    ]).toArray());
}

async function show(id) {
    return withProductsCollection(products => products.aggregate([
        { $match: idMatch(id) },
        {
            $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'category'
            }
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        { $project: { name: 1, price: 1, photo: 1, categoryId: 1, categoryName: '$category.name' } }
    ]).toArray());
}

async function store(data) {
    const name = typeof data.name === 'string' ? data.name.trim() : '';
    const price = Number(data.price);
    if (!name) throw Object.assign(new Error('Product name is required'), { status: 400 });
    if (!Number.isFinite(price) || price < 0) throw Object.assign(new Error('A valid non-negative price is required'), { status: 400 });
    if (!ObjectId.isValid(data.categoryId)) throw Object.assign(new Error('A valid categoryId is required'), { status: 400 });

    return withProductsCollection(async (products, db) => {
        const categoryId = new ObjectId(String(data.categoryId));
        const category = await db.collection('categories').findOne({ _id: categoryId });
        if (!category) throw Object.assign(new Error('Category not found'), { status: 404 });
        const product = { name, price, photo: data.photo || '', categoryId };
        const result = await products.insertOne(product);
        return { ...product, _id: result.insertedId, categoryName: category.name };
    });
}

async function updateForm(id) {
    return withProductsCollection(products => products.find(idMatch(id)).toArray());
}

async function update(data) {
    const id = data.id;
    const name = typeof data.name === 'string' ? data.name.trim() : '';
    const price = Number(data.price);
    if (!id || !name) throw Object.assign(new Error('Product id and name are required'), { status: 400 });
    if (!Number.isFinite(price) || price < 0) throw Object.assign(new Error('A valid non-negative price is required'), { status: 400 });
    if (!ObjectId.isValid(data.categoryId)) throw Object.assign(new Error('A valid categoryId is required'), { status: 400 });

    return withProductsCollection(async (products, db) => {
        const categoryId = new ObjectId(String(data.categoryId));
        if (!await db.collection('categories').findOne({ _id: categoryId })) {
            throw Object.assign(new Error('Category not found'), { status: 404 });
        }
        const update = { name, price, categoryId };
        if (data.photo) update.photo = data.photo;
        const result = await products.updateOne(idMatch(id), { $set: update });
        return result.matchedCount > 0;
    });
}

async function destroy(id) {
    return withProductsCollection(async products => {
        const result = await products.deleteOne(idMatch(id));
        return result.deletedCount > 0;
    });
}

module.exports = { index, show, store, updateForm, update, destroy };
