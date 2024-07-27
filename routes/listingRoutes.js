const express = require("express");
const router = express.Router();
const validateObjectId = require("../middlewares/validateObjectId.js"); 
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const {isLoggedIn,isOwner} = require("../middlewares/middleware.js");
// below package for file uploading
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

// show ALL listings
router.get("/", wrapAsync(async (req, res) => {
    const alllisting = await listing.find({});
    res.render("listing/index.ejs", { alllisting });
}));

// new listing POST request
router.post("/",isLoggedIn,upload.single("listing[image]") ,wrapAsync(async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    console.log("New listing added successfully");
    req.flash("success","New Listing created");
    res.redirect("/listings");
}));

// router.post("/",isLoggedIn,upload.single("listing[image]") ,wrapAsync(async (req, res) => {
//        res.send(req.file);
//     }));

// new listing GET request
router.get("/new",isLoggedIn ,(req, res) => {
    res.render("listing/new.ejs");
});

// listing update PUT request
router.put("/:id", validateObjectId,isLoggedIn,isOwner,upload.single("listing[image]") ,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let newListing = await listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = {url,filename};  
        await newListing.save();
    }
    
    req.flash("success","Listing updated successfully");
    res.redirect(`/listings/${id}`);
}));

// show listing GET request
router.get("/:id", validateObjectId, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listresult = await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if (!listresult) {
        req.flash("error","Listing does not found ");
        // res.redirect("/listings");
        return res.status(404).send("Listing not found");
    }
    res.render("listing/show.ejs", { listresult });
}));

// update listing GET request
router.get("/:id/edit", isLoggedIn,isOwner ,validateObjectId, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listEdit = await listing.findById(id);
     res.render("listing/edit.ejs", { listEdit });
}));

// listing delete DELETE request
router.delete("/:id",isLoggedIn, isOwner ,validateObjectId, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    console.log("Listing deleted successfully");
    req.flash("success","Listing deleted successfully");
    res.redirect("/listings");
}));

module.exports = router;
