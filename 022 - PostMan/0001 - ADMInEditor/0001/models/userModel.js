const { MongoClient, ObjectId, mongoConnection } = require('./mongodbConnection');

async function index() {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const users = await db.collection("users").find().toArray();
    client.close();
    return users;
}

async function show(id) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const users = await db.collection("users").find({ _id: new ObjectId(String(id)) }).toArray();
    client.close();
    return users;
}



async function updateForm(id) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const users = await db.collection("users").find({ _id: new ObjectId(String(id)) }).toArray();
    client.close();
    return users;
}


async function update(updateData) {
     const client = await MongoClient.connect(mongoConnection);
    const db = client.db();

    await db.collection("users").updateOne(
        { _id: new ObjectId(updateData.id) },
        {
            $set: {
                username: updateData.userName,
                fullname: updateData.fullname,
                password: updateData.password,
                userRole: updateData.userRole,
                isActive: updateData.isActive,
                
            }
        }
    );
}



async function destroy(id) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();

    await db.collection("users").deleteOne(
        { _id: new ObjectId(String(id)) },
        function (err, res) {
            if (err) throw err;
            client.close();
            return { "operation": "success" };
        }
    );
}


module.exports = {
    index,
    show,
    updateForm,
    update,
    destroy
}