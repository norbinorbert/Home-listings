import express from 'express';
import * as dbListings from '../db/db_listings.js';
import { loggedOutMiddleware } from '../middleware/login_status.js';

const router = express.Router();

// input validation
function isInvalidListing(req) {
  return !(
    req.city &&
    req.district &&
    req.area &&
    req.rooms &&
    req.price &&
    req.date &&
    parseFloat(req.area) &&
    parseInt(req.rooms, 10) &&
    parseFloat(req.price) &&
    Date.parse(req.date) &&
    Date.parse(req.date) <= Date.parse(new Date().toISOString().slice(0, 10))
  );
}

// check if form data is correct, then save it
router.post('/new_listing', loggedOutMiddleware, express.urlencoded({ extended: true }), async (req, res) => {
  if (isInvalidListing(req.body)) {
    console.log('New listing was tried to be inserted, but data was invalid');
    res.status(400).render('new_listing', { message: 'Incorrect input data', sessionUser: req.session.sessionUser });
    return;
  }
  req.body.Username = req.session.sessionUser.Username;
  try {
    await dbListings.insertListing(req.body);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .render('new_listing', { message: 'Unexpected error, could not insert', sessionUser: req.session.sessionUser });
    return;
  }
  console.log('Inserted new listing');
  res.status(200).redirect('/');
});

// render the new listing form
router.get('/new_listing', loggedOutMiddleware, (req, res) => {
  res.render('new_listing', { message: '', sessionUser: req.session.sessionUser });
});

export default router;
