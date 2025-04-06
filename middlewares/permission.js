const listing = require("../models/listings.js")

const permission = async(req, res, next) => {
    let id = req.params.id;
    
    let place = await listing.findByIdAndUpdate(id);
    
    if(!(res.locals.currUser && res.locals.currUser._id.equals(place.owner._id))){
        req.flash("failure", "You Dont Have Permission");
        return res.redirect(`/listings/${id}`);   
    }

    next();
}

module.exports = permission;

