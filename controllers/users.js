const user = require("../models/user.js");

module.exports.signUpForm = async (req, res) => {
    res.render("user/signup.ejs");
};


//SignUp Post Request Controller
module.exports.signUpPost = async(req, res, next) => {
    try{
        let { username, email, password } = req.body;
        let newUser = new user({ username, email });
        let registeredUser = await user.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err) {next(err);}
            req.flash("success", "Welcome To Airbnb !");
            res.redirect("/listings");
        });   
    } catch(err){
        req.flash("failure", err.message);
        res.redirect("/signup");
    }
};


//Login Form
module.exports.loginForm = async(req, res) => {
    res.render("user/login.ejs");
};

//Login Post
module.exports.loginPost = async (req, res) => {
    if(res.locals.redirectUrl){
        if(res.locals.redirectUrl.includes("_method=DELETE") || res.locals.redirectUrl.includes("/reviews")){
            let id = res.locals.params.id;
            req.flash("success", "Welcome Back!");
            return res.redirect(`/listings/${id}`);
        }
        else{
            req.flash("success", "Welcome Back!");
            return res.redirect(res.locals.redirectUrl);
        }
    }
    else if(res.locals.params && res.locals.params != null){
        let id = res.locals.params.id;

        req.flash("success", "Welcome Back!");
        return res.redirect(`/listings/${id}`);
    }
    else{
        req.flash("success", "Welcome Back!");
        return res.redirect("/listings");
    }
};

//Logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) { next(err); }
        req.flash("success", "You Logged Out!");
        res.redirect("/listings");
    });
};