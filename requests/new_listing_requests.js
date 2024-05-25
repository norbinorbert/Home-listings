import express from 'express';
import * as dbListings from '../db/db_listings.js';
import * as dbUsers from '../db/db_users.js';

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
    Date.parse(req.date)
  );
}

// check if form data is correct, then save it
router.post('/new_listing', express.urlencoded({ extended: true }), async (req, res) => {
  // users that aren't logged in can't post listings
  if (!req.session.sessionUser) {
    res.status(401).redirect('/');
    return;
  }
  if (await isInvalidListing(req.body)) {
    console.log('New listing was tried to be inserted, but data was invalid');
    const [users] = await dbUsers.getUsers();
    res
      .status(400)
      .render('new_listing', { users, message: 'Incorrect input data', sessionUser: req.session.sessionUser });
    return;
  }
  req.body.user = req.session.sessionUser;
  await dbListings.insertListing(req.body);
  console.log('Inserted new listing');
  res.status(200).redirect('/');
});

// render the new listing form
router.get('/new_listing', async (req, res) => {
  // users that aren't logged in can't post listings
  if (!req.session.sessionUser) {
    res.status(401).redirect('/');
    return;
  }
  const [users] = await dbUsers.getUsers();
  res.render('new_listing', { users, message: '', sessionUser: req.session.sessionUser });
});

export default router;
