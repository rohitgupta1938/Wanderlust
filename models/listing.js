import mongoose from "mongoose";
import Review from "./review.js";
const Schema = mongoose.Schema;
// import Review from "./review.js"
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/78/d4/09/aaravi-beach.jpg?w=400&h=-1&s=1",
    set: (v) =>
      v === ""
        ? "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/78/d4/09/aaravi-beach.jpg?w=400&h=-1&s=1"
        : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
