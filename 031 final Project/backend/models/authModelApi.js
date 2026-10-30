 const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require("bcrypt");

const mongoConnection = process.env.MONGODB_CONNECTION;


async function checkUserNameDuplication(username) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const oneUser = await db.collection("users").find({ username: username }).limit(1).toArray();
    console.log(oneUser);
    client.close();
    return oneUser;
}

async function signin(signinFormData) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const users = await db.collection("users").find({ username: signinFormData.username }).limit(1).toArray();
    client.close();
    return users;
}

async function verifySignin(id, userRole) {
    const client = await MongoClient.connect(mongoConnection);
    const db = client.db();
    const users = await db.collection("users").find({ _id: new ObjectId(String(id)) , userRole: userRole }).limit(1).toArray();
    client.close();
    return users;
}

module.exports = {
    checkUserNameDuplication,
    signin,
    verifySignin
}