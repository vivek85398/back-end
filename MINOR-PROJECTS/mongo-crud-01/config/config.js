const mongoose = require('mongoose');

async function connectMongoDb(){
    await mongoose.connect("mongodb://127.0.0.1:27017/mongo-crud-01");
    console.log("connected to MongoDB Database");
}
connectMongoDb();

module.exports = mongoose.connection;