
const { MongoClient, ObjectId, mongoConnection } = require('./mongodbConnection');

async function withCollection(callback) {
    const client = new MongoClient(mongoConnection);

    try {
        await client.connect();
        const db = client.db();
        return await callback(db.collection('categories'));
    } finally {
        await client.close();
    }
}

function index() {
    return withCollection(categories =>
        categories.find().sort({ name: 1 }).toArray()
    );
}

function store(data) {
    return withCollection(categories =>
        categories.insertOne({
            name: data.name.trim(),
            description: (data.description || '').trim(),
            createdAt: new Date(),
            updatedAt: new Date()
        })
    );
}

function update(id, data) {
    return withCollection(categories =>
        categories.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    name: data.name.trim(),
                    description: (data.description || '').trim(),
                    updatedAt: new Date()
                }
            }
        )
    );
}

function destroy(id) {
    return withCollection(categories =>
        categories.deleteOne({ _id: new ObjectId(id) })
    );
}

module.exports = {
    index,
    store,
    update,
    destroy
};
