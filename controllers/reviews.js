const review = require("../models/reviews.js");
const listing = require("../models/listings.js");


module.exports.addReviewToDatabase = async(req, res) => {

    let place = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);

    newReview.author = req.user;

    // let place = await listing.findByIdAndUpdate(req.params.id, {$push: {reviews: newReview}});  This push method also works perfectly.

    place.reviews.push(newReview);

    await place.save();
    await newReview.save();

    req.flash("success", "Review Added Successfully");

    res.redirect(`/listings/${req.params.id}`);
};

//Delte Review
module.exports.deleteReviewFromDatabase = async(req, res) => {

    let {id, reviewId} = req.params;
    let reviewPost = await review.findById(reviewId);

    if(res.locals.currUser && reviewPost.author._id.equals(res.locals.currUser._id)){
        await review.findByIdAndDelete(reviewId);
        await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        req.flash("success", "Review Deleted Successfully");
        res.redirect(`/listings/${id}`);
    }
    else{
        req.flash("failure", "You can only delete your own reviews");
        res.redirect(`/listings/${id}`);
    }  
};