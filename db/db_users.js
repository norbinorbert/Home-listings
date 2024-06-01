import pool from './db_setup.js';

// get all users
export const getUsers = () => {
  const query = 'SELECT * FROM Users';
  return pool.query(query);
};

// get a single user
export const getUserByName = (username) => {
  const query = 'SELECT * FROM Users WHERE Username = ?';
  return pool.query(query, [username]);
};

// inserting new user
export const insertUser = (username, phone, password) => {
  const query = `INSERT INTO Users (Username, Phone, Password) 
                VALUES (?, ?, ?)`;
  return pool.query(query, [username, phone, password]);
};
