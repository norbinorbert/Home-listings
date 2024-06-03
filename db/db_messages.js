import pool from './db_setup.js';

// get all messages
export const getMessagesThatBelongToUser = async (username) => {
  const query = 'SELECT * FROM Messages WHERE Source = ? OR Destination = ? ORDER BY Date';
  const [messages] = await pool.query(query, [username, username]);
  return messages;
};

// get messages between 2 users
export const getMessagesBetweenUsers = async (sourceUsername, destinationUsername) => {
  const query =
    'SELECT * FROM Messages WHERE (Source = ? AND Destination = ?) OR (Source = ? AND Destination = ?) ORDER BY Date';
  const [messages] = await pool.query(query, [
    sourceUsername,
    destinationUsername,
    destinationUsername,
    sourceUsername,
  ]);
  return messages;
};

// get messages after given timestamp
export const getMessagesBetweenUsersAfterDate = async (sourceUsername, destinationUsername, date) => {
  const query =
    'SELECT * FROM Messages WHERE Date > ? AND ((Source = ? AND Destination = ?) OR (Source = ? AND Destination = ?)) ORDER BY Date';
  const [messages] = await pool.query(query, [
    date,
    sourceUsername,
    destinationUsername,
    destinationUsername,
    sourceUsername,
  ]);
  return messages;
};

// insert new message
export const insertMessage = (sourceUsername, destinationUsername, message) => {
  const query = `INSERT INTO Messages (Source, Destination, Message, Date) 
                VALUES (?, ?, ?, now())`;
  return pool.query(query, [sourceUsername, destinationUsername, message]);
};
