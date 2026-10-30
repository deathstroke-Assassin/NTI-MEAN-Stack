const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require("bcrypt");

const mongoConnection = process.env.MONGODB_CONNECTION;


async function checkUserNameDuplication(username) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const oneUser = await db.collection("users").find({ username: username }).limit(1).toArray();
    client.close();
    return oneUser;
}

async function signup(signupFormData) {
    let doc = {};
    bcrypt.hash(signupFormData.password, 11, async (err, hash) => {
        if (err) {
            //
        }
        else {
            // hash            
            doc.fullName = signupFormData.fullName;
            doc.username = signupFormData.username;
            doc.password = hash;
            doc.userRole = signupFormData.userRole;

            const client = await MongoClient.connect(mongoConnection);
            const db = client.db();
            await db.collection("users").insertOne(doc, function (err, res) {
                if (err) throw err;
                client.close();
                return { "operation": "success" };
            });
        }
    });
}

async function signin(signinFormData) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const users = await db.collection("users").find({ username: signinFormData.username }).limit(1).toArray();
    client.close();
    return users;
}

async function verifySignin(id, userRole) {
    console.log("verifySignin id:", id);
console.log("verifySignin role:", userRole);
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const users = await db.collection("users").find({ _id: new ObjectId(String(id)) , userRole: userRole }).limit(1).toArray();
    client.close();
    return users;
}

module.exports = {
    checkUserNameDuplication,
    signup,
    signin,
    verifySignin
}