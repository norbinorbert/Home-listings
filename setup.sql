CREATE DATABASE IF NOT EXISTS home_listings;

USE home_listings;

CREATE TABLE IF NOT EXISTS users(
    userID INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50),
    phone VARCHAR(15)
);

INSERT INTO users (username, phone) VALUES 
('Alice Smith', '111-111-1111'),
('Bob Johnson', '222-222-2222'),
('Charlie Brown', '333-333-3333'),
('Diana Lee', '444-444-4444'),
('Ella Davis', '555-555-5555'),
('Frank Wilson', '666-666-6666'),
('Grace Martinez', '777-777-7777'),
('Henry White', '888-888-8888'),
('Isabel Garcia', '999-999-9999'),
('Jack Robinson', '101-010-1010');