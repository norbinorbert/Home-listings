import pool from './db_setup.js';

// get pictures to display
export const getPicturesByListingID = (listingID) => {
  const query = 'SELECT picture FROM Pictures WHERE ListingID = ?';
  return pool.query(query, [listingID]);
};

// add a picture to existing listing
export const addPictureToListing = (listingID, picture) => {
  const query = 'INSERT INTO Pictures VALUES (?, ?)';
  return pool.query(query, [listingID, picture]);
};
