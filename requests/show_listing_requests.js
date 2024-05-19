import express from 'express';
import * as dbListings from '../db/db_listings.js';
import * as dbPictures from '../db/db_pictures.js';
import * as dbUsers from '../db/db_users.js';

const router = express.Router();

// main page
router.get('/', async (req, res) => {
  const [searchResults] = await dbListings.getListings();
  res.render('listings', { searchResults });
});

// check if any listings match the search criteria and list them
router.get('/search', express.urlencoded({ extended: true }), async (req, res) => {
  const [searchResults] = await dbListings.getListingWithFilters(req.query);
  console.log('A search was completed');
  res.render('listings', { searchResults });
});

// individual listings
router.get('/listing/[0-9]*', async (req, res) => {
  const listingID = req.url.substring(req.url.lastIndexOf('/') + 1);
  const [listings] = await dbListings.getListingByID(listingID);
  if (listings.length !== 0) {
    const [pictures] = await dbPictures.getPicturesByListingID(listingID);
    const listing = listings[0];
    const [users] = await dbUsers.getUserByID(listing.UserID);
    const user = users[0];
    res.render('listing', { listing, pictures, user, message: '' });
  } else {
    res.status(404).render('error', { message: "Listing doesn't exist" });
  }
});

// render more attributes on the main page
router.get('/get_listing/[0-9]*', async (req, res) => {
  const listingID = req.url.substring(req.url.lastIndexOf('/') + 1);
  const [listings] = await dbListings.getListingByID(listingID);
  if (listings.length !== 0) {
    const listing = listings[0];
    res.send({ listing });
  } else {
    res.status(404).send({ message: "Listing doesn't exist" });
  }
});

export default router;
