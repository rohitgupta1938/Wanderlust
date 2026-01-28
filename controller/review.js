import Listing from "../models/listing.js";
import Review from "../models/review.js";
export const reviewController = {
  postReview: async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    if(req.body.review.comment.trim()===''){
      req.flash("error", "Review is empty!");
      return res.redirect(`/wanderlust/listings/${id}`);
    }
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    req.flash("success", "New Review is Added!");
    res.redirect(`/wanderlust/listings/${id}`);
  },
  distroyReview: async (req, res) => {
    let { id, reviewId } = req.params;
    if (req.user._id.equals())
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const rev = await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review is Deleted!");
    res.redirect(`/wanderlust/listings/${id}`);
  },
};
