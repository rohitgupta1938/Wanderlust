import Listing from "../models/listing.js";
const listingController = {
  index: async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listing/index", { allListings });
  },
  renderNew: async (req, res) => {
    res.render("./listing/new.ejs");
  },
  createListing: async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image=req.file.path;
    await newListing.save();
    req.flash("success", "New Listing is Created!");
    res.redirect("/listings");
  },
  showListing: async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");
    }
    res.render("./listing/show.ejs", { listing });
  },
  updateListing: async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing is Updated!");
    res.redirect(`/listings/${id}`);
  },
  editListing: async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist");
      return res.redirect("/listings");
    }
    res.render("./listing/edit.ejs", { listing });
  },
  distroyListing: async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is Deleted!");
    res.redirect("/listings");
  },
};

export default listingController;
