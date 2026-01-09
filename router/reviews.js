import express from "express";
const router = express.Router({mergeParams:true});
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/listing.js";
import Review from "../models/review.js";
import { reviewSchema } from "../schema.js";

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(404, error);
  } else {
    next();
  }
};

//  Post reviews
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    let ans = await listing.save();
    await newReview.save();

    console.log(ans.reviews);
    res.redirect(`/listings/${id}`);
  })
);
// Delete reviews
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const rev = await Review.findByIdAndDelete(reviewId);
    console.log(rev);
    res.redirect(`/listings/${id}`);
  })
);

export default router;
