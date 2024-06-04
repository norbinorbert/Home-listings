import pool from './db_setup.js';

// used to check if listing exists or displaying single listing
export const getListingByID = async (listingID) => {
  const query = 'SELECT * FROM Listings WHERE ListingID = ?';
  const [listings] = await pool.query(query, [listingID]);
  return listings[0];
};

// get all listings in case no filtering is done
export const getListings = async () => {
  const query = 'SELECT * FROM Listings';
  const [listings] = await pool.query(query);
  return listings;
};

// used for filtering listings
export const getListingsWithFilters = async (req) => {
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
  const [listings] = await pool.query(query, [
    req.city,
    req.city,
    req.district,
    req.district,
    req['min-price'],
    req['min-price'],
    req['max-price'],
    req['max-price'],
  ]);
  return listings;
};

// inserting new listing
export const insertListing = (req) => {
  const query = `INSERT INTO Listings (City, District, Area, Rooms, Price, Date, Username) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
  return pool.query(query, [req.city, req.district, req.area, req.rooms, req.price, req.date, req.Username]);
};

// deleting a listing
export const deleteListingByID = (listingID) => {
  const query = 'DELETE FROM Listings WHERE ListingID = ?';
  return pool.query(query, [listingID]);
};

// changes a users name to NULL in the listings table, so we can update in users table
export const changeUsernamePart1 = async (username) => {
  const query = 'UPDATE Listings SET Username = NULL WHERE Username = ?';
  await pool.query(query, [username]);
};

// changes the NULL values to the new username
export const changeUsernamePart2 = async (newUsername) => {
  const query = 'UPDATE Listings SET Username = ? WHERE Username IS NULL';
  await pool.query(query, [newUsername]);
};

// changes a listings information
export const editListingInfo = async (listingID, city, district, area, rooms, price) => {
  const query = 'UPDATE Listings SET City = ?, District = ?, Area = ?, Rooms = ?, Price = ? WHERE ListingID = ?';
  await pool.query(query, [city, district, area, rooms, price, listingID]);
};
