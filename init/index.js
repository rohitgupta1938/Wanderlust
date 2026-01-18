import mongoose from "mongoose";
import Listing from "../models/listing.js";
import initData from "./data.js";
import Review from "../models/review.js";
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then((response) => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
const initDB = async () => {
  await Listing.deleteMany({});
  await Review.deleteMany({});
  initData.data=initData.data.map((obj)=> ({...obj,owner:'696b724a5095353407a6d27a'}))
  await Listing.insertMany(initData.data);
};
initDB();
