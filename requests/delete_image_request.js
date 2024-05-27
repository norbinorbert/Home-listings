import express from 'express';
import { unlink } from 'fs';
import * as dbPictures from '../db/db_pictures.js';
import * as dbListings from '../db/db_listings.js';
import loggedOutMiddleware from '../middleware/logged_out.js';

const router = express.Router();

// remove an image from the database and file system that matches the descriptions
router.delete('/delete_image', loggedOutMiddleware, express.json(), async (req, res) => {
  const { pictureName } = req.body;
  const { listingID } = req.body;
  const [listings] = await dbListings.getListingByID(listingID);
  const listing = listings[0];
  // if logged in user is not the owner of the listing, then don't delete image
  if (listing.Username !== req.session.sessionUser) {
    res.status(401).send({ message: "This listing doesn't belong to you" });
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
