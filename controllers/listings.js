const listing = require("../models/listings.js")

//Index Listing
module.exports.index = async (req, res) => {
    let list = await listing.find();

    if(!list){
        req.flash("failure", "No listings found");
    }
    
    res.render("listings/list.ejs", {list});
};

//New Listing Form
module.exports.newForm = (req, res) => {
    res.render("listings/new.ejs");
};

//Add Place
module.exports.addPlace = async (req, res, next) => {
    req.body.list.owner = req.user;

    let url = req.file.path;
    let filename = req.file.filename;

    req.body.list.image = {url, filename};

    await listing.insertOne(req.body.list);

    req.flash("success", "Place Added Successfully");

    res.redirect("/listings");
};

//Place Detail
module.exports.placeDetail = async (req, res) => {
    let id = req.params.id;
    let place = await listing.findById(id).populate({path : "reviews",
                 populate :{path : "author"}})
                .populate("owner");


    if(!place){
        req.flash("failure", "No Such Place Exist");
        res.redirect("/listings");
    }
    else{
        res.render("listings/placeDetail.ejs", {place});
    }
};

module.exports.editForm = async (req, res) => {
    let id = req.params.id;
    let place = await listing.findById(id);

    let placeImageUrl = place.image.url;
    let originalImageUrl = placeImageUrl.replace("/upload", "/upload/ar_1.0,c_fill,h_250/bo_5px_solid_lightblue");
    
    if(!place){
        req.flash("failure", "No Such Place Exist");
        res.redirect("/listings");
    }
    else{
        res.render("listings/edit.ejs", {place, originalImageUrl});
    }
};

module.exports.editDatabase =  async (req, res) => {
    let id = req.params.id;

    console.log({...req.body.list});

    let place = await listing.findById(id);

    if(!(res.locals.currUser && res.locals.currUser._id.equals(place.owner._id))){
        req.flash("failure", "You Dont Have Permission");
        return res.redirect(`/listings/${id}`);   
    }

    let placeUpdate = await listing.findByIdAndUpdate(id, {...req.body.list});

    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;

        placeUpdate.image = {url, filename};

        await placeUpdate.save();
    }

    req.flash("success", "Place Updated Successfully");
    res.redirect(`/listings/${id}`);   
};

//Delete Listing
module.exports.destroyListing = async (req, res) => {
    let id = req.params.id;
    await listing.findByIdAndDelete(id);

    req.flash("success", "Place Deleted Successfully");

    res.redirect("/listings");
};

