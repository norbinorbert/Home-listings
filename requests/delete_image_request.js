import express from 'express';
import { unlink } from 'fs';
import * as dbPictures from '../db/db_pictures.js';
import * as dbListings from '../db/db_listings.js';
import { loggedOutMiddleware } from '../middleware/login_status.js';

const router = express.Router();

// remove an image from the database and file system that matches the descriptions
router.delete('/delete_image', loggedOutMiddleware, express.json(), async (req, res) => {
  const { pictureName } = req.body;
  const { listingID } = req.body;
  const listing = await dbListings.getListingByID(listingID);
  if (!listing) {
    res.status(404).render('error', { message: "Listing doesn't exist", sessionUser: req.session.sessionUser });
    return;
  }
  // if logged in user is not the owner of the listing and isn't an admin, then don't delete image
  if (listing.Username !== req.session.sessionUser.Username && req.session.sessionUser.Role !== 'admin') {
    res
      .status(403)
      .render('error', { message: "This listing doesn't belong to you", sessionUser: req.session.sessionUser });
    return;
  }
  const [dbResponse] = await dbPictures.deletePicture(listingID, pictureName);
  if (dbResponse.affectedRows) {
    unlink(`./public/Pictures/${pictureName}`, () => {
      console.log(`Removed picture with name ${pictureName}`);
      res.send({ message: 'Image removed from listing' });
    });
  } else {
    res.status(500).send({ message: 'Error while removing image' });
  }
});

export default router;
