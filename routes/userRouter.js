const express = require('express');
const wrapAsync = require('../utils/wrapAsync.js');
const router = express.Router();
const user = require("../models/user.js");
const passport = require("passport");

const userController = require("../controllers/users.js");


//SignUp Form
router.get("/signup", wrapAsync( userController.signUpForm ));

router.post("/signup", wrapAsync( userController.signUpPost ) );

//Login Form
router.get("/login", wrapAsync( userController.loginForm ));

router.post("/login",
    async (req, res, next) => {
        if (req.session.url) {
            
            res.locals.redirectUrl = req.session.url; 
            res.locals.params = req.session.params;

            // console.log(res.locals.redirectUrl);//Middleware to redirect user to page they were on/trying to access before logging in
        }
        next();
    },

    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true}),

    wrapAsync( userController.loginPost ));

//Logoout
router.get("/logout", userController.logout );

module.exports = router;