const { MongoClient} = require('mongodb')
const URL = process.env.MONGO_URL ?? "mongodb://localhost:27017"

let client
async function connectToMongo() {
  try {
    if (!client) {
      client = await MongoClient.connect(URL)
    }
    return client;
  } catch (err) {
    console.log(err)
  }
}

async function getMongoCollection(dbName, collectionName) {
    const client = await connectToMongo()
    return client.db(dbName).collection(collectionName)
  }


module.exports = { connectToMongo, getMongoCollection }