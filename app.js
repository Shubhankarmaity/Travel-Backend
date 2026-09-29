if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASTDB_URL;

main().then(() => {
    console.log("connect to db");
})
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);//to get the ejs template
app.use(express.static(path.join(__dirname, "/public")));//to get the all files in public folder

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter:24 * 3600,
})

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
})

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}

app.use(session(sessionOption));
app.use(flash());//flash is always is being use before all the routes

//use the passport methods 
app.use(passport.initialize());
app.use(passport.session());//if user visit same browser into different pages so it did not show to re login
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());//passport to store the serialize user into session
passport.deserializeUser(User.deserializeUser());//passport to store the deserialize user into session

//it means after the session user must be relogin fo  use the webpage 


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"shubhankar@gmail.com",
//         username:"delta-student2"
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");//its checks all the things in the DB like username is exists or not save the username and password
//     res.send(registeredUser);
// })

//listings
app.use("/listings", listingRouter);
//Reviews
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// app.get(("/testListing"), async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Vill",
//         description: "By the beach",
//         price: 1200,
//         location: "calangute,Goa",
//         country: "india",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful test");
// });

//test the code using ci/cd
app.get("/test",async(req,res)=>{
    res.json({
        msg:"FINAL UPDATE: test was successful"
    });
})

// page not found error
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found"));
});

//TO handel the errors
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("./listings/error.ejs", { message });
    // res.status(statusCode).send(message);
});


app.listen(8080, "0.0.0.0", () => {
    console.log("app is listening on all network interfaces");
});
