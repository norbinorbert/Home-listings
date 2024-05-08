import express from 'express';
import * as dbListings from '../db/db_listings.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const [searchResults] = await dbListings.getListings();
  console.log(searchResults);
  res.render('listings', { searchResults });
});

// check if any listings match the search criteria and list them
router.get('/search', express.urlencoded({ extended: true }), async (req, res) => {
  const [searchResults] = await dbListings.getListingWithFilters(req.query);
  console.log('A search was completed');
  res.render('listings', { searchResults });
});

export default router;
