const { MongoClient, ObjectId, mongoConnection } = require('./mongodbConnection');

async function index() {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const categories = await db.collection("categories").find().toArray();
    client.close();
    return categories;
}

async function store(data) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    await db.collection("categories").insertOne({
        name: data.name,
        description: data.description
    });
    client.close();
}

async function show(id) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const categories = await db.collection("categories").find({ _id: new ObjectId(String(id)) }).toArray();
    client.close();
    return categories;
}

async function updateForm(id) {
    return show(id);
}

async function update(data) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    await db.collection("categories").updateOne(
        { _id: new ObjectId(String(data.id)) },
        { $set: { name: data.name, description: data.description } }
    );
    client.close();
}

async function destroy(id) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    await db.collection("categories").deleteOne({ _id: new ObjectId(String(id)) });
    client.close();
}

module.exports = {
    index,
    store,
    show,
    updateForm,
    update,
    destroy
};
