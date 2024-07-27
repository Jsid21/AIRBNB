const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

const dburl = "mongodb://joshisid2110:sid_j21@cluster0.exrfq1p.mongodb.net:27017/?retryWrites=true&w=majority&appName=Cluster0";
// console.log(dburl);

main().then((res)=>{
    console.log("Connected to database");
})

async function main(){
    await mongoose.connect(dburl);
}

const initDB = async ()=>{
    await listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"669b9e7b7de2bf9960394068"}));
    await listing.insertMany(initData.data);
    console.log("data was initialize");
}

initDB();