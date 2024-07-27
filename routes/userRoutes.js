const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const localStrat = require("passport-local");
const {saveRedirectUrl} = require("../middlewares/middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync (async (req,res,next)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({username, email});
        // method given below is to store the data into the database
        const regUser =  await User.register(newUser, password);
        req.login(regUser,(err)=>{
            if (err) {
                return next(err);
            }
            req.flash("success","You are logged in ! Welcome to WanderLust");
            res.redirect("/listings");
        })
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login", saveRedirectUrl ,passport.authenticate('local', { failureRedirect: '/login', failureFlash:true}) ,wrapAsync (async (req,res)=>{
    req.flash("success","You are logged in ! Welcome to WanderLust");
    let url = res.locals.redirectUrl || "/listings";
    res.redirect(url);
    console.log("user logged in");
}));

router.get("/logout", (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        console.log("User logged out");
        req.flash("success","You are Logged out !");
        res.redirect("/listings");
    })
})

module.exports = router;