import pool from './db_setup.js';

export const getUsers = () => {
  const query = 'SELECT * FROM Users';
  return pool.query(query);
};
