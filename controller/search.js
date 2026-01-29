import Listing from "../models/listing.js";
 const searchController = async (req, res) => {
  let filterValue = req.query.q.toLocaleLowerCase();
  filterValue = filterValue.trim();
  console.log(filterValue);
  let allListings = await Listing.find({});
  allListings = allListings.filter((listing) => {
    let title = listing.title.toLocaleLowerCase();
    let description = listing.description.toLocaleLowerCase();
    let country = listing.country.toLocaleLowerCase();
    let location = listing.location.toLocaleLowerCase();
    if (
      title.includes(filterValue) ||
      description.includes(filterValue) ||
      location.includes(filterValue) ||
      country.includes(filterValue)
    ) {
      return listing;
    }
  });
  res.render("listing/index", { allListings });
};

export default searchController;