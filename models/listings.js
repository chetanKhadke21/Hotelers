const mongoose = require("mongoose");
const reviews = require("./reviews.js");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url : String,
    filename: String
  },
  price: {
    type: Number,
    min: 1,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  reviews : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'review',
    }
  ],
  owner : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "user"
  }
});

listingSchema.post("findOneAndDelete", async(place) => {
  if(place){
    await reviews.deleteMany({_id : {$in : place.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;