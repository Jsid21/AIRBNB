const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

const dburl = "mongodb+srv://joshisid2110:sid_j21@cluster0.exrfq1p.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Cluster0";

async function main() {
    try {
        await mongoose.connect(dburl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Adjust the timeout as needed
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });
        console.log("Connected to database");

        await initDB();
    } catch (err) {
        console.error("Failed to connect to the database", err);
    }
}

async function initDB() {
    try {
        await listing.deleteMany({});
        initData.data = initData.data.map((obj) => ({ ...obj, owner: "66a504721c702cd5749c4170" }));
        await listing.insertMany(initData.data);
        console.log("Data was initialized");
    } catch (err) {
        console.error("Failed to initialize data", err);
    }
}

main();

// mongoose.connection.on("connected", () => {
//     console.log("Mongoose connected to db");
// });

// mongoose.connection.on("error", (err) => {
//     console.log("Mongoose connection error", err);
// });

// mongoose.connection.on("disconnected", () => {
//     console.log("Mongoose disconnected");
// });
