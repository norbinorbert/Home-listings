import express from 'express';
import multer from 'multer';
import { existsSync, mkdirSync } from 'fs';
import * as dbPictures from '../db/db_pictures.js';
import * as dbListings from '../db/db_listings.js';
import * as dbUsers from '../db/db_users.js';
import { loggedOutMiddleware } from '../middleware/login_status.js';

const router = express.Router();
router.use(loggedOutMiddleware);

// make a directory where we will upload the images
const uploadDir = './public/Pictures';
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}

// check if file is in right format and check if ID is correct
async function filter(req, file, cb) {
  // bad file type
  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
    const err = new Error('Invalid mime type');
    err.name = 'BadMime';
    return cb(err);
  }
  // listing doesn't exist
  const listingID = req.url.substring(req.url.lastIndexOf('/') + 1);
  const listing = await dbListings.getListingByID(listingID);
  if (!listing) {
    const err = new Error("Listing doesn't exist");
    err.name = 'BadID';
    return cb(err);
  }
  // listing exists
  return cb(null, true);
}

// multer middleware for uploading files, filter includes form data validation
const multerUpload = multer({
  dest: uploadDir,
  fileFilter: filter,
});

// image uploaded in the form
const image = multerUpload.single('image-for-listing');

// check if there were any errors when loading the file, then upload photo
router.post('/upload_photo/[0-9]*', async (req, res) => {
  // if logged in user is not the owner of the listing, then don't upload photo
  const listingID = req.url.substring(req.url.lastIndexOf('/') + 1);
  const listing = await dbListings.getListingByID(listingID);
  if (!listing) {
    res.status(404).render('error', { message: "Listing doesn't exist", sessionUser: req.session.sessionUser });
    return;
  }
  if (listing.Username !== req.session.sessionUser.Username) {
    res
      .status(403)
      .render('error', { message: "This listing doesn't belong to you", sessionUser: req.session.sessionUser });
    return;
  }

  image(req, res, async (err) => {
    if (err) {
      console.log('New photo was tried to be uploaded, but data was invalid');
      switch (err.name) {
        case 'BadMime': {
          const pictures = await dbPictures.getPicturesByListingID(listingID);
          const user = await dbUsers.getUserByName(listing.Username);
          res.status(400).render('listing', {
            listing,
            pictures,
            user,
            message: 'Please only upload png or jpeg images',
            sessionUser: req.session.sessionUser,
          });
          return;
        }
        case 'BadID': {
          res.status(404).render('error', { message: "Listing doesn't exist", sessionUser: req.session.sessionUser });
          return;
        }
        default:
      }
    }
    await dbPictures.addPictureToListing(listingID, req.file.filename);
    console.log(`Successfully uploaded image for listing with ID = ${listingID}`);

    // after uploading, redirect back to the listing's page
    res.redirect(`/listing/${listingID}`);
  });
});

export default router;
