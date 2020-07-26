DROP DATABASE `treez-order-service-api`;
CREATE DATABASE `treez-order-service-api`;
USE `treez-order-service-api`;

DROP TABLE `treez-order-service-api`.`inventory`;
DROP TABLE `treez-order-service-api`.`order_inventory`;
DROP TABLE `treez-order-service-api`.`order`;

CREATE TABLE `order` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `order_customer_mail` varchar(45) NOT NULL,
  `order_status` varchar(45) NOT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `inventory` (
  `inventory_item_id` int NOT NULL AUTO_INCREMENT,
  `inventory_item_name` varchar(45) NOT NULL,
  `inventory_item_description` varchar(45) DEFAULT NULL,
  `inventory_item_price` double unsigned NOT NULL,
  `inventory_item_quantity` int(11) unsigned zerofill NOT NULL,
  PRIMARY KEY (`inventory_item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `order_inventory` (
  `order_inventory_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `inventory_id` int DEFAULT NULL,
  `order_quantity` int DEFAULT NULL,
  PRIMARY KEY (`order_inventory_id`),
  KEY `fk_order` (`order_id`),
  CONSTRAINT `fk_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

