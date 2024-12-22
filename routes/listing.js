const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { validateListing, isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
// const upload = multer({ dest: "uploads/" });
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index)) // Index Route
  .post(
    isLoggedIn, // Create Route
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) // Show Route
  .put(
    isLoggedIn, // Update Route
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn, // Delete Route
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
