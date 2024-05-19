CREATE DATABASE IF NOT EXISTS hipages;

USE hipages;

CREATE USER 'hipages_user'@'%' IDENTIFIED WITH mysql_native_password BY 'hellopages';

GRANT ALL PRIVILEGES ON hipages.* TO 'hipages_user'@'localhost';

FLUSH PRIVILEGES;

CREATE TABLE leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(255), 
  price FLOAT,
  status VARCHAR(10),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO leads (category, price, status) 
VALUES 
  ('Plumber', 100.50, null),
  ('Electrician', 200.75, 'accepted'),
  ('Landscaper', 150.00, 'declined');
