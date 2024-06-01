import pool from './db_setup.js';

// get all users
export const getUsers = async () => {
  const query = 'SELECT * FROM Users';
  const [users] = await pool.query(query);
  return users;
};

// get a single user
export const getUserByName = async (username) => {
  const query = 'SELECT * FROM Users WHERE Username = ?';
  const [users] = await pool.query(query, [username]);
  return users[0];
};

// inserting new user
export const insertUser = (username, phone, password) => {
  const query = `INSERT INTO Users (Username, Phone, Password, Role) 
                VALUES (?, ?, ?, 'user')`;
  return pool.query(query, [username, phone, password]);
};
