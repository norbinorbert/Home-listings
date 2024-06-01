import express from 'express';
import * as dbListings from '../db/db_listings.js';
import * as dbPictures from '../db/db_pictures.js';
import * as dbUsers from '../db/db_users.js';

const router = express.Router();

// main page
router.get('/', async (req, res) => {
  const searchResults = await dbListings.getListings();
  res.render('listings', { searchResults, sessionUser: req.session.sessionUser });
});

// check if any listings match the search criteria and list them
router.get('/search', express.urlencoded({ extended: true }), async (req, res) => {
  const searchResults = await dbListings.getListingsWithFilters(req.query);
  console.log('A search was completed');
  res.render('listings', { searchResults, sessionUser: req.session.sessionUser });
});

// individual listings
router.get('/listing/[0-9]*', async (req, res) => {
  const listingID = req.url.substring(req.url.lastIndexOf('/') + 1);
  const listing = await dbListings.getListingByID(listingID);
  if (listing) {
    const pictures = await dbPictures.getPicturesByListingID(listingID);
    const user = await dbUsers.getUserByName(listing.Username);
    res.render('listing', { listing, pictures, user, message: '', sessionUser: req.session.sessionUser });
  } else {
    res.status(404).render('error', { message: "Listing doesn't exist", sessionUser: req.session.sessionUser });
  }
});

// render more attributes on the main page
router.get('/get_listing/[0-9]*', async (req, res) => {
  const listingID = req.url.substring(req.url.lastIndexOf('/') + 1);
  const listing = await dbListings.getListingByID(listingID);
  if (listing) {
    res.send({ listing });
  } else {
    res.status(404).send({ message: "Listing doesn't exist" });
  }
});

export default router;
