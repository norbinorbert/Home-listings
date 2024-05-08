import express from 'express';
import * as dbListings from '../db/db_listings.js';

const router = express.Router();

// check if any listings match the search criteria and list them
router.get('/search', express.urlencoded({ extended: true }), async (req, res) => {
  if (!req.query.city) {
    console.log('Search request failed because city was not provided');
    res.status(400).send('Please provide a city');
    return;
  }
  const [searchResults] = await dbListings.getListingWithFilters(req.query);
  console.log('A search was completed');
  if (searchResults.length !== 0) {
    res.send(searchResults);
  } else {
    res.redirect('/');
  }
});

export default router;
