if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require('mongodb');
const listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const path = require("path");
const { reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const validateObjectId = require("./middlewares/validateObjectId"); // Import the middleware
const listRoutes = require("./routes/listingRoutes.js");
const reviewRoutes = require("./routes/reviewRoute.js");
const userRoutes = require("./routes/userRoutes.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
// below two libraries are important for user managemant
const passport = require("passport");
const localStrat = require("passport-local");
const User = require("./models/user.js");
const { log } = require("console");
// below for file upload to cloud
// require('dotenv').config()

// require('dotenv').config();
// console.log(process.env.SECRET);


const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// to store all session details on mongodb
const store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("error in mongodb session store",err);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly :true
    }
}

app.use(session(sessionOptions));
app.use(flash());

// library imported middlewares for password saving in database
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrat(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser",async (req,res)=>{
//     let fakeUser =  new User({
//         email: "student123@gmail.com",
//         username :"student"
//     })
//     // method given below is to store the data into the database
//     let registereduser= await User.register(fakeUser, "helloword");
//     res.send(registereduser);
// });

// router middlewares -
app.use("/listings",listRoutes);
app.use("/listings/:id/reviews", (req, res, next) => {
    req.listingId = req.params.id;
    next();
}, reviewRoutes);
app.use("/",userRoutes);

app.use((err, req, res, next) => {
    let { status, message } = err;
    res.status(status).send(message);
});
// const dburl = "mongodb+srv://joshisid2110:sid_j21@cluster0.exrfq1p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// main().then((res) => {
//     console.log("Connected to database");
// })

// async function main() {
//     await mongoose.connect(dburl);
// }

const uri = process.env.MONGODB_URI;

async function main() {
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("Connected to database");
    } catch (err) {
        console.error("Failed to connect to the database", err);
    }
}

main().catch(err => console.log(err));



app.get("/", (req, res) => {
    res.send("hi");
});

app.listen(8080, () => {
    console.log(`Server is listening at ${8080}`);
});
