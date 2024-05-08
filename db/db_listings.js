import pool from './db_setup.js';

// usually used to check if listing exists
export const getListingsByID = (listingID) => {
  const query = 'SELECT * FROM Listings WHERE ListingID = ?';
  return pool.query(query, [listingID]);
};

// get all listings in case no filtering is done
export const getListings = () => {
  const query = 'SELECT * FROM Listings';
  return pool.query(query);
};

// used for filtering listings
export const getListingWithFilters = (req) => {
  const query = `SELECT * FROM Listings 
                WHERE (? IS NULL OR City = ?) 
                AND (? IS NULL OR District = ?) 
                AND (? IS NULL OR Price >= ?) 
                AND (? IS NULL OR Price <= ?)`;
  if (!req.city) {
    req.city = null;
  }
  if (!req.district) {
    req.district = null;
  }
  if (!req['min-price']) {
    req['min-price'] = null;
  }
  if (!req['max-price']) {
    req['max-price'] = null;
  }
  return pool.query(query, [
    req.city,
    req.city,
    req.district,
    req.district,
    req['min-price'],
    req['min-price'],
    req['max-price'],
    req['max-price'],
  ]);
};

// inserting new listing
export const insertListing = (req) => {
  const query = `INSERT INTO Listings (City, District, Area, Rooms, Price, Date, UserID) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
  return pool.query(query, [req.city, req.district, req.area, req.rooms, req.price, req.date, req.userID]);
};
