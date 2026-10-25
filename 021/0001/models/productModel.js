const { MongoClient, ObjectId, mongoConnection } = require('./mongodbConnection');

async function index() {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const products = await db.collection("products").find().toArray();
    client.close();
    return products;
}

async function show(id) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const products = await db.collection("products").find({ _id: new ObjectId(String(id)) }).toArray();
    client.close();
    return products;
}


async function store(createFormData) {
    let doc = {};
    doc.productName = createFormData.productName;
    doc.weight = createFormData.weight;
    doc.photo = createFormData.photo;
    doc.isAccepted = false
    
    doc.isUpdateAccpt = null;
    doc.isDelAccpt = null;

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
    const products = await db.collection("products").find({ _id: new ObjectId(String(id)) }).toArray();
    client.close();
    return products;
}


// async function update(updateFormData) {
//     const id = updateFormData.id;
//     const productName = updateFormData.productName;
//     const weight = updateFormData.weight;
//     const photo = updateFormData.photo;
//     doc.newState = false

//     if (photo != "") {
//         var updateQuery = { "productName": productName, "weight": weight, "photo": photo };
//     }
//     else {
//         var updateQuery = { "productName": productName, "weight": weight };
//     }

//     const client = await MongoClient.connect(mongoConnection);
//     const db = client.db();

//     await db.collection("products").updateOne(
//         { _id: new ObjectId(String(id)) },
//         { $set: updateQuery },
//         function (err, res) {
//             if (err) throw err;
//             client.close();
//             return { "operation": "success" };
//         }
//     );
// }



async function update(updateFormData) {

    const id = updateFormData.id;

    const newState = {
        productName: updateFormData.productName,
        weight: updateFormData.weight
    };

    if (updateFormData.photo != "") {
        newState.photo = updateFormData.photo;
    }

    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();

    await db.collection("products").updateOne(
        { _id: new ObjectId(String(id)) },
        {
            $set: {
                newState: newState,
                isUpdateAccpt: false
            }
        }
    );

    client.close();
}


async function destroy(id) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();

    await db.collection("products").deleteOne(
        { _id: new ObjectId(String(id)) },
        function (err, res) {
            if (err) throw err;
            client.close();
            return { "operation": "success" };
        }
    );
}

// async function addIsAccepted() {
//     const client = await MongoClient.connect(mongoConnection);
//     const db = client.db();

//     await db.collection("products").updateMany(
//         { isAccepted: { $exists: false } },
//         {
//             $set: {
//                 isAccepted: false
//             }
//         }
//     );

//     client.close();
// }


async function acceptedProducts() {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();

    const products = await db.collection("products")
        .find({ isAccepted: true })
        .toArray();

    client.close();

    return products;
}


async function pendingProducts() {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();

    const CreatedProducts = await db.collection("products")
        .find({ isAccepted: false })
        .toArray();
  const markedUpdateProducts = await db.collection("products")
        .find({ isUpdateAccpt: false })
        .toArray();
const markedDeleteProducts = await db.collection("products")
        .find({ isDelAccpt: false })
        .toArray();
    client.close();

    return {CreatedProducts, markedDeleteProducts, markedUpdateProducts}
}

async function productsAccept(id) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    await db.collection("products").updateOne(
        { _id: new ObjectId(String(id)) },
        {
            $set: {
                isAccepted: true
            }
        }
    );

    client.close();
}

async function productsAcceptUpdate(id) {

    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();

    const product = await db.collection("products").findOne({
        _id: new ObjectId(String(id))
    });

    if (product && product.newState) {

        await db.collection("products").updateOne(
            { _id: product._id },
            {
                $set: {
                    productName: product.newState.productName,
                    weight: product.newState.weight,
                    isUpdateAccpt: true
                },
                $unset: {
                    newState: ""
                }
            }
        );
    }

    client.close();
}
async function productsRejectUpdate(id) {

    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();

    await db.collection("products").updateOne(
        { _id: new ObjectId(String(id)) },
        {
            $set: {
                isUpdateAccpt: null
            }
        }
    );

    client.close();
}


async function markdelete(id) {

    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();

    await db.collection("products").updateOne(
        { _id: new ObjectId(String(id)) },
        {
            $set: {
                isDelAccpt: false
            }
        }
    );

    client.close();
}

module.exports = {
    index,
    show,
    store,
    updateForm,
    update,
    destroy,
    acceptedProducts,
    pendingProducts,
    productsAccept,
    productsAcceptUpdate,
    productsRejectUpdate,
    markdelete
}