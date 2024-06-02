import express from 'express';
import { unlink } from 'fs';
import * as dbPictures from '../db/db_pictures.js';
import * as dbListings from '../db/db_listings.js';
import { loggedOutMiddleware } from '../middleware/login_status.js';

const router = express.Router();

// remove a listing and all images associated with it
router.post('/delete_listing/[0-9]*', loggedOutMiddleware, async (req, res) => {
  const listingID = req.url.substring(req.url.lastIndexOf('/') + 1);
  const listing = await dbListings.getListingByID(listingID);
  if (!listing) {
    res.status(404).render('error', { message: "Listing doesn't exist", sessionUser: req.session.sessionUser });
    return;
  }
  // if logged in user is not the owner of the listing and isn't an admin, then don't delete it
  if (listing.Username !== req.session.sessionUser.Username && req.session.sessionUser.Role !== 'admin') {
    res
      .status(403)
      .render('error', { message: "This listing doesn't belong to you", sessionUser: req.session.sessionUser });
    return;
  }

  // delete all pictures before trying to delete listing, because of foreign key constraint
  const pictures = await dbPictures.getPicturesByListingID(listingID);
  const dbResponses = [];
  for (let i = 0; i < pictures.length; i++) {
    dbResponses.push(dbPictures.deletePicture(listingID, pictures[i].picture));
    unlink(`./public/Pictures/${pictures[i].picture}`, () => {
      console.log(`Removed picture with name ${pictures[i].picture}`);
    });
  }
  await Promise.all(dbResponses);
  await dbListings.deleteListingByID(listingID);
  res.redirect('/');
});

export default router;
