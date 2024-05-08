import express from 'express';
import multer from 'multer';
import { existsSync, mkdirSync } from 'fs';
import * as dbPictures from '../db/db_pictures.js';
import * as dbListings from '../db/db_listings.js';

const router = express.Router();

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
  const [listing] = await dbListings.getListingByID(listingID);
  if (listing.length === 0) {
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
router.post('/upload_photo/[0-9]*', (req, res) => {
  image(req, res, async (err) => {
    if (err) {
      console.log('New photo was tried to be uploaded, but data was invalid');
      switch (err.name) {
        case 'BadMime': {
          res.status(400).render('error', { message: 'Please only upload png or jpeg images' });
          return;
        }
        case 'BadID': {
          res.status(404).render('error', { message: "Listing doesn't exist" });
          return;
        }
        default:
      }
    }
    const listingID = req.url.substring(req.url.lastIndexOf('/') + 1);
    await dbPictures.addPictureToListing(listingID, req.file.filename);
    console.log(`Successfully uploaded image for listing with ID = ${listingID}`);

    // after uploading, redirect to the listings page
    const [listings] = await dbListings.getListingByID(listingID);
    const listing = listings[0];
    const [pictures] = await dbPictures.getPicturesByListingID(listingID);
    res.render('listing', { listing, pictures });
  });
});

export default router;
