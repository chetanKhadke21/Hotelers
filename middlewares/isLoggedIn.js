const isLoggedIn = (req, res, next) => {
    req.session.url = req.originalUrl;
    req.session.params = req.params;

    if(!req.isAuthenticated()){
        req.flash("failure", "Please Login First");
        res.redirect("/login");
    }
    else{
        next();
    }
} ;

module.exports = isLoggedIn;

