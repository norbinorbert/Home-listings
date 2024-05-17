import pool from './db_setup.js';

// get all users
export const getUsers = () => {
  const query = 'SELECT * FROM Users';
  return pool.query(query);
};

// get a single user
export const getUserByID = (userID) => {
  const query = 'SELECT * FROM Users WHERE UserID = ?';
  return pool.query(query, [userID]);
};
