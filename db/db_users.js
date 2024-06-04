import * as dbMessages from './db_messages.js';
import * as dbListings from './db_listings.js';
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

// changes a users name, this affects the messages and listings table as well
export const changeUsername = async (username, newUsername) => {
  try {
    await dbMessages.changeUsernamePart1(username);
    await dbListings.changeUsernamePart1(username);

    const query = 'UPDATE Users SET Username = ? WHERE Username = ?';
    await pool.query(query, [newUsername, username]);

    await dbMessages.changeUsernamePart2(newUsername);
    await dbListings.changeUsernamePart2(newUsername);
  } catch (err) {
    // if something went wrong (for example, given username was too long), revert the changes
    console.log(err);
    await dbMessages.changeUsernamePart2(username);
    await dbListings.changeUsernamePart2(username);
    throw Error();
  }
};

// changes a users phone number
export const changePhoneNumber = (phone, username) => {
  const query = 'UPDATE Users SET Phone = ? WHERE Username = ?';
  return pool.query(query, [phone, username]);
};

// changes a users password
export const changePassword = (password, username) => {
  const query = 'UPDATE Users SET Password = ? WHERE Username = ?';
  return pool.query(query, [password, username]);
};
