CREATE DATABASE orders;

USE orders;

CREATE TABLE item(
id int NOT NULL AUTO_INCREMENT,
name varchar(255) NOT NULL,
price integer NOT NULL,
description varchar(255) NOT NULL,
type ENUM('eletronic', 'headset', 'watch', 'phone', 'mouse', 'tv') NOT NULL,
discount int NULL,
PRIMARY KEY(id)
);

CREATE USER 'test'@'%' IDENTIFIED BY 'test';
GRANT CREATE ON * . * TO 'test'@'%';
GRANT DELETE ON * . * TO 'test'@'%';
GRANT INSERT ON * . * TO 'test'@'%';
GRANT SELECT ON * . * TO 'test'@'%';
GRANT UPDATE ON * . * TO 'test'@'%';
GRANT ALTER ON * . * TO 'test'@'%';
FLUSH PRIVILEGES;