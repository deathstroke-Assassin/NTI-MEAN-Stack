const { MongoClient, ObjectId, mongoConnection } = require('./mongodbConnection');

async function withCategoriesCollection(callback) {
    const client = await MongoClient.connect(mongoConnection);
    try {
        return await callback(client.db().collection("categories"));
    } finally {
        await client.close();
    }
}

async function index() {
    return withCategoriesCollection(categories => categories.find().toArray());
}

async function store(data) {
    const name = typeof data.name === "string" ? data.name.trim() : "";
    const description = typeof data.description === "string" ? data.description.trim() : "";
    if (!name) throw Object.assign(new Error("Category name is required"), { status: 400 });

    return withCategoriesCollection(async categories => {
        const result = await categories.insertOne({ name, description });
        return { _id: result.insertedId, name, description };
    });
}

async function show(id) {
    if (!ObjectId.isValid(id)) return [];
    return withCategoriesCollection(categories => categories.find({ _id: new ObjectId(String(id)) }).toArray());
}

async function updateForm(id) {
    return show(id);
}

async function update(data) {
    const name = typeof data.name === "string" ? data.name.trim() : "";
    const description = typeof data.description === "string" ? data.description.trim() : "";
    if (!ObjectId.isValid(data.id) || !name) {
        throw Object.assign(new Error("A valid category id and name are required"), { status: 400 });
    }
    return withCategoriesCollection(async categories => {
        const result = await categories.updateOne(
            { _id: new ObjectId(String(data.id)) },
            { $set: { name, description } }
        );
        return result.matchedCount > 0;
    });
}

async function destroy(id) {
    if (!ObjectId.isValid(id)) return false;
    return withCategoriesCollection(async categories => {
        const result = await categories.deleteOne({ _id: new ObjectId(String(id)) });
        return result.deletedCount > 0;
    });
}

module.exports = {
    index,
    store,
    show,
    updateForm,
    update,
    destroy
};
