const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");


const listingsController = require("../controllers/listings.js")

const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


//router .rout method is use to if i have same route then it did not want to rewrite every time
router
    .route("/")
    .get(wrapAsync(listingsController.index))//Index route
    .post(isLoggedIn, upload.single('listing[image]'), validateListing,wrapAsync(listingsController.creatListing));//create Route
//New Route
router.get("/new", isLoggedIn, listingsController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingsController.showListing))//Show Route
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingsController.updateListing))//Update Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingsController.destroyListing))//Delete Route



//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingsController.renderEditForm));

module.exports = router;