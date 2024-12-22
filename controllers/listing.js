const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } }) // using nested populate to access author for each review
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  // Custom Error Handling
  // try {
  //   const newListing = new Listing(req.body.listing);
  //   await newListing.save();
  //   res.redirect("/listings");
  // } catch(err) {
  //   next(err);
  // }

  // Following code is used to check whether the individual item is present in listing or not but it is not a good method, we will use joi npm package to validate individual items for listing
  // if(!req.body.listing) {
  //  throw new ExpressError(400, "Send valid data for listing");
  // }
  // const newListing = new Listing(req.body.listing);
  // if(!newListing.title) {
  //   throw new ExpressError(400, "Title is missing!");
  // }
  // if(!newListing.description) {
  //   throw new ExpressError(400, "Description is missing!");
  // }
  // if(!newListing.location) {
  //   throw new ExpressError(400, "Location is missing!");
  // }

  // The below code is now shifted in a function named validateListing
  // let result = listingSchema.validate(req.body);
  // console.log(result);
  // if(result.error) {
  //   throw new ExpressError(400,result.error)
  // }


  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, "..", filename);

  const newListing = new Listing(req.body.listing);
  // console.log(req.user);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "Send valid data for listing");
  // }
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  
  if(typeof req.file !== "undefined") {
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = { url, filename };  
  await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
