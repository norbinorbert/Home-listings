import express from 'express';
import morgan from 'morgan';
import { existsSync, mkdirSync } from 'fs';
import multer from 'multer';
import * as dbListings from './db/db_listings.js';
import * as dbPictures from './db/db_pictures.js';

const app = express();
app.use(morgan('tiny'), express.static('./public'));

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
app.post('/new_listing', express.urlencoded({ extended: true }), async (req, res) => {
  if (isInvalidListing(req.body)) {
    console.log('New listing was tried to be inserted, but data was invalid');
    res.status(400).send('Incorrect input data');
    return;
  }
  await dbListings.insertListing(req.body);
  console.log('Inserted new listing');
  res.redirect('/');
});

// make a directory where we will upload the images
const uploadDir = './Resources';
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}

// check if file is in right format and check if ID is correct
async function filter(req, file, cb) {
  // no ID provided
  if (!req.body['listing-id']) {
    const err = new Error('No ID provided');
    err.name = 'NoID';
    return cb(err);
  }
  // bad file type
  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
    const err = new Error('Invalid mime type');
    err.name = 'BadMime';
    return cb(err);
  }
  // listing doesn't exist
  const [listing] = await dbListings.getListingsByID(parseInt(req.body['listing-id'], 10));
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
app.post('/upload_photo', (req, res) => {
  image(req, res, async (err) => {
    if (err) {
      console.log('New photo was tried to be uploaded, but data was invalid');
      switch (err.name) {
        case 'BadMime': {
          res.status(400).send('Please only upload png or jpeg images');
          return;
        }
        case 'NoID': {
          res.status(400).send('Please provide a listing ID');
          return;
        }
        case 'BadID': {
          res.status(404).send("Listing doesn't exist");
          return;
        }
        default:
      }
    }
    const listingID = parseInt(req.body['listing-id'], 10);
    await dbPictures.addPictureToListing(listingID, req.file.filename);
    console.log(`Successfully uploaded image for listing with ID = ${listingID}`);
    res.redirect('/');
  });
});

// check if any listings match the search criteria and list them
app.get('/search', express.urlencoded({ extended: true }), async (req, res) => {
  if (!req.query.city) {
    console.log('Search request failed because city was not provided');
    res.status(400).send('Please provide a city');
    return;
  }
  const [searchResults] = await dbListings.getListingWithParameters(req.query);
  console.log('A search was completed');
  if (searchResults.length !== 0) {
    res.send(searchResults);
  } else {
    res.redirect('/');
  }
});

app.listen(8080, () => {
  console.log('Server listening on http://localhost:8080/ ...');
});
