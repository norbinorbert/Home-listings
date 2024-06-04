import mysql from 'mysql2/promise.js';

// create a connection
const pool = await mysql.createPool({
  connectionLimit: 10,
  database: 'home_listings',
  host: 'localhost',
  port: 3306,
  user: 'webprog',
  password: 'admin',
});

// create the necessary tables
try {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS Users(
        Username VARCHAR(50) PRIMARY KEY,
        Phone VARCHAR(20),
        Password VARCHAR(300),
        Role VARCHAR(10));`,
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
        Username VARCHAR(50),
        FOREIGN KEY (Username) REFERENCES Users(Username));`,
  );
  await pool.query(
    `CREATE TABLE IF NOT EXISTS Pictures(
        ListingID INT,
        Picture VARCHAR(100),
        FOREIGN KEY (ListingID) REFERENCES Listings(ListingID),
        PRIMARY KEY(ListingID, Picture));`,
  );
  await pool.query(
    `CREATE TABLE IF NOT EXISTS Messages(
      MessageID INT PRIMARY KEY AUTO_INCREMENT,
      Message TEXT,
      Source VARCHAR(50),
      Destination VARCHAR(50),
      Date TIMESTAMP,
      FOREIGN KEY (Source) REFERENCES Users(Username),
      FOREIGN KEY (Destination) REFERENCES Users(Username));`,
  );

  console.log('Tables created successfully');
} catch (err) {
  console.error(`Create table error: ${err}`);
  process.exit(1);
}

try {
  // default admin user
  await pool.query(`INSERT INTO Users (Username, Password, Role) 
                  VALUES ('admin', '$2b$10$DW7Dp0bzSBwX4KfNJP4lZOzPrG7cPfdtFANV9D1w7qFjCunGJmVJG', 'admin')`);
} catch (err) {
  console.log('Cannot insert admin, it already exists');
}

export default pool;
