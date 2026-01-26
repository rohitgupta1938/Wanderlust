import express from "express";
const router = express.Router();
import multer from "multer";
import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn, isOwner, validateListing } from "../middleware.js";
import  listingController  from "../controller/listing.js";
import {storage} from "../cloudConfig.js"
const upload = multer({ storage });

//index Route
router.get("/",wrapAsync(listingController.index));

//new route
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNew));

//create listing
// router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));
router.post('/',isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));
// Show Route

router.get("/:id", wrapAsync(listingController.showListing));

//update listing
router.patch("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing));

//edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.renderEditListingPage));

//delete listing
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.distroyListing));

export default router;
