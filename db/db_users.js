import pool from './db_setup.js';

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

// get all the users whose name start with the given prefix
export const getUsersByNamePrefix = async (prefix) => {
  const query = 'SELECT Username, Phone, Role FROM Users WHERE Username LIKE ? ORDER BY Username';
  if (!prefix) {
    prefix = '%';
  } else {
    prefix = `${prefix}%`;
  }
  const [users] = await pool.query(query, [prefix]);
  return users;
};

// changes the role from user to admin and vice-versa
export const changeUserRole = (username, oldRole) => {
  const query = 'UPDATE Users SET Role = ? WHERE Username = ?';
  let newRole;
  if (oldRole === 'user') {
    newRole = 'admin';
  } else {
    newRole = 'user';
  }
  return pool.query(query, [newRole, username]);
};
