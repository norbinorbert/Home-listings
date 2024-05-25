DROP DATABASE IF EXISTS home_listings;
CREATE DATABASE home_listings;
USE home_listings;

DROP USER IF EXISTS 'webprog'@'';
CREATE USER 'webprog'@'' IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON *.* TO 'webprog'@'';