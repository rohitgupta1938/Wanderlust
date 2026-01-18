import Listing from './models/listing.js'
export const isLoggedIn = (req, res, next) => {
  req.session.redirectUrl = req.originalUrl;
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to create a listing!");
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
};

export const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  console.log(error);
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