const express = require('express');
const router = express.Router({mergeParams : true});
const listing = require('../models/listings.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {reviewSchema} = require("../schemaValidation.js");
const isLoggedIn = require('../middlewares/isLoggedIn.js');

const reviewController = require("../controllers/reviews.js");

const validateReview = (req, res, next) => {

    let {error} = reviewSchema.validate(req.body);

    if(error){
        throw new ExpressError (400, error.details[0].message);
    } else{
        next();
    }
};


//Post Request For Reviews
router.post("/", isLoggedIn, validateReview, wrapAsync( reviewController.addReviewToDatabase ));

// Delete Review Route
router.delete("/:reviewId", isLoggedIn, wrapAsync( reviewController.deleteReviewFromDatabase));

module.exports = router;