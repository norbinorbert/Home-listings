import mysql from 'mysql2/promise.js';

const pool = await mysql.createPool({
  connectionLimit: 10,
  database: 'home_listings',
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'admin',
});

try {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS Users(
        UserID INT PRIMARY KEY AUTO_INCREMENT,
        Username VARCHAR(50),
        Phone VARCHAR(15));`,
  );
  await pool.query(
    `CREATE TABLE IF NOT EXISTS Listings(
        ListingID INT PRIMARY KEY AUTO_INCREMENT,
        City VARCHAR(50),
        District VARCHAR(50),
        Area DOUBLE,
        Rooms INT,
        Price DOUBLE,
        Date DATE,
        UserID INT,
        FOREIGN KEY (UserID) REFERENCES Users(UserID));`,
  );
  await pool.query(
    `CREATE TABLE IF NOT EXISTS Pictures(
        ListingID INT,
        Picture VARCHAR(100),
        FOREIGN KEY (ListingID) REFERENCES Listings(ListingID),
        PRIMARY KEY(ListingID, Picture));`,
  );
  console.log('Tables created successfully');
} catch (err) {
  console.error(`Create table error: ${err}`);
  process.exit(1);
}

export default pool;
