import Listing from './models/listing.js'
import Review from './models/review.js';
import { listingSchema, reviewSchema } from "./schema.js";
export const isLoggedIn = (req, res, next) => {
  req.session.redirectUrl = req.originalUrl;
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to do this!");
    return res.redirect("/login");
  }
  next();
};
export const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

export const isOwner = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.ReqUser._id)) {
    req.flash("error", "You don’t have permission to do this");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

export const isReviewAuthor = async (req, res, next) => {
   let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.ReqUser._id)) {
    req.flash("error", "You don’t have permission to do this");
    return res.redirect(`/listings/${id}`);
  }
  next();
};


export const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(404, error);
  } else {
    next();
  }
};

export const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(404, error);
  } else {
    next();
  }
};
