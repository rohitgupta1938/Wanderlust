import express from "express";
const router = express.Router({mergeParams:true});
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/listing.js";
import Review from "../models/review.js";
import {validateReview,isLoggedIn,isReviewAuthor} from '../middleware.js'
//  Post reviews
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    let ans = await listing.save();
    await newReview.save();
    req.flash("success","New Review is Added!");
    res.redirect(`/listings/${id}`);
  })
);
// Delete reviews
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    if(req.user._id.equals())
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const rev = await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review is Deleted!");
    res.redirect(`/listings/${id}`);
  })
);

export default router;