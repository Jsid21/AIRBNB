const mongoose = require("mongoose");
const schema = mongoose.Schema;
const review = require("./reviews");

const listSchema =new schema({
    title: {type: String,required: true},
    description: String,
    image : {
        url: String,
        filename:String,
        },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type: schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type: schema.Types.ObjectId,
        ref:"User"
    }
});

listSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await review.deleteMany({_id :{$in: listing.reviews}})
    }
});


const Listing = mongoose.model("Listing",listSchema);
module.exports = Listing;