const listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(! req.isAuthenticated()){
        req.session.redirectURL = req.originalUrl;
        req.flash("error","Please login")
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if (req.session.redirectURL) {
        res.locals.redirectUrl = req.session.redirectURL;
    }
    next();
} 

module.exports.isOwner = async (req,res,next)=>{
    let { id } = req.params;
    let listByID = await listing.findById(id);
    if ( res.locals.currUser && !listByID.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error","You are not aurthorized to delete");
        console.log("someone tried to delete");
        return res.redirect(`/listings/${id}`); 
    }
    next();
}

module.exports.isAuthor = async (req,res,next)=>{
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if ( review && !review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error","You are not aurthorized to delete");
        console.log("someone tried to delete");
        return res.redirect(`/listings/${id}`); 
    }
    next();
}