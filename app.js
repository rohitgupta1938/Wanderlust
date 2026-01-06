import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import Listing from "./models/listing.js";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import "@tailwindplus/elements";
import wrapAsync from "./utils/wrapAsync.js";
import ExpressError from "./utils/ExpressError.js";
import listingSchema from "./schema.js";
import Review from "./models/review.js";
const app = express();

// ES Module me __dirname banane ka tarika
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.use(methodOverride("_method"));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";
main()
  .then((response) => {
    console.log(response);
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(404, error);
  } else {
    next();
  }
};

app.get(
  "/testListing",
  wrapAsync(async (req, res) => {
    const sampleListing = new Listing({
      title: "My new Velas",
      description: "By the Beach",
      price: 1000,
      location: "Dhrawi, Mumbai",
      country: "India",
    });
    await sampleListing.save();
    console.log("Sample was added");
    res.send("Success");
  })
);

//index Route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("./listing/index.ejs", { allListings });
  })
);

//new route
app.get(
  "/listings/new",
  wrapAsync(async (req, res) => {
    console.log("work is done");
    res.render("./listing/new.ejs");
  })
);

//create listing
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// Show Route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listing/show.ejs", { listing });
  })
);

//update listing
app.patch(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
  })
);

//edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listing/edit.ejs", { listing });
  })
);

//delete listing
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    console.log(listing);
    res.redirect("/listings");
  })
);
app.post("/listings/:id/review", async (req, res) => {
  let id=req.params.id;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  let ans=await listing.save();
  await newReview.save();
  
  console.log(ans.reviews);
  res.redirect(`/listings/${id}`)
});

app.get("/", (req, res) => {
  res.send("Get Request is working");
});

//404 handler — matches ALL unknown routes
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("./error.ejs", { err });
});

app.listen(8080, () => {
  console.log("Server is working on port : 8080");
});
