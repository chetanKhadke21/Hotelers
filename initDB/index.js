const mongoose = require('mongoose');
const initData = require('./init.js');
const listing = require('../models/listings.js');

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb"

main()
.then((res) => console.log("Connection Successful"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
};

const initDB = async () => {
    await listing.deleteMany({});
    let data = initData.data.map((obj) => ({...obj, owner : "67e92eb0b9a9e4a97b29d323"}));
    await listing.insertMany(data);
    console.log(data);
};

initDB();
