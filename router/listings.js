import express from "express";
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/listing.js";
import { listingSchema } from "../schema.js";
import { isLoggedIn ,isOwner,validateListing} from "../middleware.js";

//index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("./listing/index.ejs", { allListings });
  })
);

//new route
router.get(
  "/new",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    res.render("./listing/new.ejs");
  })
);

//create listing
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing is Created!");
    res.redirect("/listings");
  })
);

// Show Route
router.get(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
      console.log(listing);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");
    }
    console.log("hello", listing.owner);
    res.render("./listing/show.ejs", { listing });
  })
);

//update listing
router.patch(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing is Updated!");
    res.redirect(`/listings/${id}`);
  })
);

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");
    }
    res.render("./listing/edit.ejs", { listing });
  })
);

//delete listing
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is Deleted!");
    res.redirect("/listings");
  })
);

export default router;
