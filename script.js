import express from 'express';
import morgan from 'morgan';
import { existsSync, mkdirSync } from 'fs';
import multer from 'multer';

let listingID = 0;
const listings = [];
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
app.post('/new_listing', express.urlencoded(), (req, res) => {
  if (isInvalidListing(req.body)) {
    console.log('New listing was tried to be inserted, but data was invalid');
    res.status(400).send('Incorrect input data');
    return;
  }
  listings.push({
    id: listingID,
    city: req.body.city,
    district: req.body.district,
    area: parseFloat(req.body.area),
    rooms: parseInt(req.body.rooms, 10),
    price: parseFloat(req.body.price),
    date: Date.parse(req.body.date),
    images: [],
  });
  console.log(`Inserted new listing with ID = ${listingID}`);
  res.send(`Listing created.<br>Listing ID: ${listingID}`);
  listingID++;
});

// make a directory where we will upload the images
const uploadDir = './Resources';
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}

// check if file is in right format and check if ID is correct
function filter(req, file, cb) {
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
  // listing exists
  for (let i = 0; i < listings.length; i++) {
    if (listings[i].id === parseInt(req.body['listing-id'], 10)) {
      return cb(null, true);
    }
  }
  // listing doesn't exist
  const err = new Error("Listing doesn't exist");
  err.name = 'BadID';
  return cb(err);
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
  image(req, res, (err) => {
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
          res.status(400).send("Listing doesn't exist");
          return;
        }
        default:
      }
    }
    for (let i = 0; i < listings.length; i++) {
      if (listings[i].id === parseInt(req.body['listing-id'], 10)) {
        listings[i].images.push(req.file.path);
        console.log(`Successfully uploaded image for listing with ID = ${listings[i].id}`);
      }
    }
    res.send('Image successfully uploaded');
  });
});

// check if the listing matches the search criteria
function doesListingMeetRequirements(req, listing) {
  if (listing.city === req.city) {
    if (req.district && listing.district !== req.district) {
      return false;
    }
    if (req['min-price'] && listing.price < parseFloat(req['min-price'])) {
      return false;
    }
    if (req['max-price'] && listing.price > parseFloat(req['max-price'])) {
      return false;
    }
    return true;
  }
  return false;
}

// check if any listings match the search criteria and list them
app.get('/search', express.urlencoded(), (req, res) => {
  if (!req.query.city) {
    console.log('Search request failed because city was not provided');
    res.status(400).send('Please provide a city');
    return;
  }
  const searchResults = [];
  for (let i = 0; i < listings.length; i++) {
    if (doesListingMeetRequirements(req.query, listings[i])) {
      searchResults.push(listings[i]);
    }
  }
  console.log('A search was completed');
  if (searchResults.length !== 0) {
    res.send(searchResults);
  } else {
    res.send('No listings match the search criteria');
  }
});

app.listen(8080, () => {
  console.log('Server listening on http://localhost:8080/ ...');
});
