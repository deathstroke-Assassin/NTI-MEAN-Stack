const { MongoClient, ObjectId, mongoConnection } = require('./mongodbConnection');

/* matches _id stored either as ObjectId (new docs) or as String (legacy docs) */
function idMatch(id) {
    return ObjectId.isValid(id)
        ? { $or: [{ _id: new ObjectId(String(id)) }, { _id: String(id) }] }
        : { _id: String(id) };
}

async function index() {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const products = await db.collection("products").aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
            }
        }
    ]).toArray();
    client.close();
    return products;
}

async function show(id) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const products = await db.collection("products").aggregate([
        {
            $match: idMatch(id)
        },
        {
            $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
            }
        }
    ]).toArray();
    client.close();
    return products;
}


async function store(createFormData) {
    let doc = {};
    doc.name = createFormData.name;
    doc.price = createFormData.price;
    doc.photo = createFormData.photo;
    doc.categoryId = new ObjectId(String(createFormData.categoryId));

    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();

    await db.collection("products").insertOne(doc, function (err, res) {
        if (err) throw err;
        client.close();
        return { "operation": "success" };
    });
}


async function updateForm(id) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const products = await db.collection("products").find(idMatch(id)).toArray();
    client.close();
    return products;
}


async function update(updateFormData) {
    const id = updateFormData.id;
    const name = updateFormData.name;
    const price = updateFormData.price;
    const photo = updateFormData.photo;
    const categoryId = new ObjectId(String(updateFormData.categoryId));

    if (photo != "") {
        var updateQuery = { "name": name, "price": price, "photo": photo, "categoryId": categoryId };
    }
    else {
        var updateQuery = { "name": name, "price": price, "categoryId": categoryId };
    }

    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();

    await db.collection("products").updateOne(
        idMatch(id),
        { $set: updateQuery },
        function (err, res) {
            if (err) throw err;
            client.close();
            return { "operation": "success" };
        }
    );
}



async function destroy(id) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();

    await db.collection("products").deleteOne(
        idMatch(id),
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
    store,
    updateForm,
    update,
    destroy
};
