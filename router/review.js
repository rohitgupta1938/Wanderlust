import express from "express";
const router = express.Router({mergeParams:true});
import wrapAsync from "../utils/wrapAsync.js";
import {validateReview,isLoggedIn,isReviewAuthor} from '../middleware.js'
import { reviewController } from "../controller/review.js";

//  Post reviews
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.postReview));

// Delete reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.distroyReview));

export default router;