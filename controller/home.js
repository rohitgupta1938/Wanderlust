import Listing from "../models/listing.js";
export const HomePageController=async(req,res)=>{
  const allListings = await Listing.find({});
  res.render("./includes/hero.ejs",{ allListings });
}