const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const validateObjectId = require("../middlewares/validateObjectId");
const Review = require("../models/reviews.js");
const listing = require("../models/listing.js");
const user = require("../models/user.js");
const {isLoggedIn,isOwner,isAuthor} = require("../middlewares/middleware.js");

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
}

router.post("/",isLoggedIn,validateReview ,wrapAsync(async (req, res) => {
    try {
        let resList = await listing.findById(req.listingId);
        if (!resList) {
            return res.status(404).send("Listing not found");
        }
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        resList.reviews.push(newReview);
        await newReview.save();
        await resList.save();
        console.log("new review saved");
        req.flash("success","New review is added ");
        res.redirect(`/listings/${req.listingId}`);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}));

router.delete("/:reviewid" ,validateObjectId,isLoggedIn,isAuthor ,wrapAsync(async (req, res) => {
    let { reviewid } = req.params;
    await listing.findByIdAndUpdate(req.listingId, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    console.log("Review deleted");
    req.flash("success","Listing review deleted ");
    res.redirect(`/listings/${req.listingId}`);
}));

module.exports = router;
