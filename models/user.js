const mongoose = require("mongoose");
const schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new schema({
    email:{
        type:String,
        required:true
    },
});

// no need to add username and password fields as PassPort is going to manage it

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);