const { getMongoCollection } = require("./db")
const { ObjectId } = require('mongodb')

async function readAll(dbName, collectionName) {
    const collection = await getMongoCollection(dbName, collectionName)
    const result = await collection.find().toArray()
    return result
}

async function readOneEmail(dbName, collectionName, email) {
    const collection = await getMongoCollection(dbName, collectionName)
    const result = await collection.findOne({ "email": email })
    console.log(result)
    return result
}

async function readOneByObjectId(dbName, collectionName, objectId) {
    const collection = await getMongoCollection(dbName, collectionName)
    const result = await collection.findOne({ "_id": ObjectId.createFromHexString(objectId) })
    return result
}

module.exports = { readAll, readOneEmail, readOneByObjectId }