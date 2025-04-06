const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const listingRouter = require("./routes/listingRouter.js");
const reviewRouter = require("./routes/reviewRouter.js");
const userRouter = require("./routes/userRouter.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const user = require("./models/user.js");


const store = MongoStore.create({
    mongoUrl: process.env.MONGO_ATLAS_URL,
    crypto: {
        secret: "secretKey"
    },
    touchAfter: 24 * 3600 // 1 day
});

app.use(session({
    store,
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true,
    cookie :{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        maxAge : 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true
    }
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

const ATLAS_URL = process.env.MONGO_ATLAS_URL

main()
.then((res) => console.log("Connection Successful"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(ATLAS_URL);
};

app.listen(8080, (req, res) => {
    console.log('Server is running on port 8080');
});

// app.get("/", (req, res) => {
//     res.send("Hello, World!");
// });

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demoUser", async (req, res) => {
//     let newUser = new user({
//         username: "testUser",
//         email: "testUser@gmail.com"
//     });

//     let User = await user.register(newUser, "password");

//     res.send(User);
// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



// 404 error page
app.all("*", (req, res, next) => {
   throw new ExpressError(404, "Page Not Found");
});

//Error handler
app.use((err, req, res, next) => {
    let {status = 500, message = "Internal Server Error"} = err;
    res.status(status).render("error.ejs", {message});
});




















// app.get("/listings", async (req, res) => {
//     let  listing1 = new listing({
//         title : "The Heaven Villa",
//         description : "A beautiful villa with a sea view",
//         price : 7000,
//         location : "Goa",
//         country : "India"
//     });

//     await listing1.save();
// });