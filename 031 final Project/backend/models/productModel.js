const { MongoClient, ObjectId, mongoConnection } = require('./mongodbConnection');

async function index() {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const products = await db.collection("products").find().toArray();
    client.close();
    return renameProductsID(products);
}
module.exports={
    index,
}
