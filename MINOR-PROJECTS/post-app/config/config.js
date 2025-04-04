const mongoose = require('mongoose');

async function connectMongoDb() {
    await mongoose.connect("mongodb://127.0.0.1:27017/post-app");
    console.log('connected to MongoDb Database');
}
connectMongoDb();

module.exports = mongoose.connection;