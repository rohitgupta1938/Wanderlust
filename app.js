import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import Listing from "./models/listing.js";
import methodOverride from "method-override";

const app = express();

// ES Module me __dirname banane ka tarika
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.get("/testListing", async (req, res) => {
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
});

//index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find();
  res.render("./listing/index.ejs", { allListings });
});

//new route
app.get("/listings/new", async (req, res) => {
  console.log("work is done");
  res.render("./listing/new.ejs");
});

//create listing
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});
// Show Route
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listing/show.ejs", { listing });
});


//update listing
app.patch("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//edit route
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listing/edit.ejs", { listing });
});

//delete listing
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);
  console.log(listing);
  res.redirect("/listings");
});


app.get("/", (req, res) => {
  res.send("Get Request is working");
});

app.listen(8080, () => {
  console.log("Server is working on port : 8080");
});
