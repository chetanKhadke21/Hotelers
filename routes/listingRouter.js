const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const isLoggedIn = require("../middlewares/isLoggedIn.js");
const permission = require("../middlewares/permission.js");
const listingController = require("../controllers/listings.js");
const {listingSchema} = require("../schemaValidation.js");
const ExpressError = require('../utils/ExpressError.js'); 
const multer = require("multer");
const storage = require("../cloudinaryConfig.js")
const upload = multer({storage});
require("dotenv").config();




//Schema Validations
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError (400, error.details[0].message);
    } else{
        next();
    }
};


// Add Place form
router.get("/new", isLoggedIn, wrapAsync(listingController.newForm) );

//Place List
router.get("/", wrapAsync(listingController.index));

// Place add post request  and also added condition to set default value for image.url
router.post("/", upload.single("list[image]"), validateListing,  wrapAsync(listingController.addPlace));

// Place detail Route
router.get("/:id", wrapAsync(listingController.placeDetail));

//Edit form Route
router.get("/:id/edit", isLoggedIn,permission, wrapAsync(listingController.editForm));

//Edit the database route
router.put("/:id", permission, upload.single("list[image]"), validateListing, wrapAsync(listingController.editDatabase));

//Delete Place route
router.delete("/:id", isLoggedIn, permission, wrapAsync(listingController.destroyListing));


module.exports = router;