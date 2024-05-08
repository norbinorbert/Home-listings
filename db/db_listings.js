import pool from './db_setup.js';

export const getListingsByID = (listingID) => {
  const query = 'SELECT * FROM Listings WHERE ListingID = ?';
  return pool.query(query, [listingID]);
};

// used for filtering listings
export const getListingWithParameters = (req) => {
  const query = `SELECT * FROM Listings 
                WHERE City = ? 
                AND (? IS NULL OR District = ?) 
                AND (? IS NULL OR Price >= ?) 
                AND (? IS NULL OR Price <= ?)`;
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
