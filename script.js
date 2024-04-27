import express from 'express';
import path from 'path';
import morgan from 'morgan';

const listings = [];
let listingID = 0;
const staticDir = path.join(process.cwd(), 'public');
const app = express();
app.use(morgan('tiny'), express.static(staticDir));

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
  res.send(`Listing created\nListing ID: ${listingID}`);
  listingID++;
});

app.post('/upload_photo', (req, res) => {
  res.send('yo2');
});

app.get('/search', express.urlencoded(), (req, res) => {
  res.send('yo3');
});

app.listen(8080, () => {});
