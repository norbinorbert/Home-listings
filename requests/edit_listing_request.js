import express from 'express';
import { loggedOutMiddleware } from '../middleware/login_status.js';
import * as dbListings from '../db/db_listings.js';

const router = express.Router();

// check if given data is valid
function areValidValues(req) {
  return (
    req.listingID &&
    req.city &&
    req.district &&
    req.area &&
    req.rooms &&
    req.price &&
    parseInt(req.listingID, 10) &&
    parseFloat(req.area) &&
    parseInt(req.rooms, 10) &&
    parseFloat(req.price)
  );
}

// changes a listings information if input data is valid
router.post('/edit_listing', loggedOutMiddleware, express.json(), async (req, res) => {
  if (!areValidValues(req.body)) {
    res.status(400).send({ message: 'Incorrect input data' });
    return;
  }
  // check if owner sent the request
  const listing = await dbListings.getListingByID(req.body.listingID);
  if (listing.Username !== req.session.sessionUser.Username) {
    res.status(403).send({ message: "This listing doesn't belong to you" });
  }
  try {
    await dbListings.editListingInfo(
      req.body.listingID,
      req.body.city,
      req.body.district,
      req.body.area,
      req.body.rooms,
      req.body.price,
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Unexpected error. Please try again' });
  }

  // no response message, since user will visually see the change
  res.send({});
});

export default router;
