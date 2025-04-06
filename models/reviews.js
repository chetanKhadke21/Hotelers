const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    rating : {
        type : Number,
        min : 1,
        max : 5
    },
    comments : {
        type : String,
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    author: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }
});

module.exports = mongoose.model("review", reviewSchema);