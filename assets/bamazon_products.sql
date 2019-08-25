-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: localhost    Database: bamazon
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products`
(
  `item_id` int
(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar
(45) NOT NULL,
  `department_name` varchar
(45) NOT NULL,
  `price` float NOT NULL DEFAULT '0.1',
  `stock_quantity` int
(11) DEFAULT '10000',
  PRIMARY KEY
(`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `
products`
VALUES
  (1, 'Blender', 'Appliances', 349.99, 10000),
  (2, 'Toaster Oven', 'Appliances', 164.39, 10000),
  (3, 'Air Fryer', 'Appliances', 107.98, 10000),
  (4, 'Hand Vaccum', 'Appliances', 39.42, 10000),
  (5, 'Coffee Maker', 'Appliances', 157.95, 10000),
  (6, 'Pressure cooker', 'Appliances', 89.96, 10000),
  (7, 'Refrigerator', 'Appliances', 2100, 10000),
  (8, 'Electric can Opener', 'Appliances', 29.85, 10000),
  (9, 'Food Processor', 'Appliances', 44.95, 10000),
  -- (10, 'Carpet Cleaner', 'Appliances', 188.99, 10000),
  -- (11, 'Refrigerator', 'Appliances', 2100, 10000),
  -- (12, 'Ice Maker', 'Appliances', 409.96, 10000),
  -- (13, 'Desktop', 'Computers', 669.99, 10000),
  -- (14, 'iPad Pro', 'Computers', 674.99, 10000),
  -- (15, 'Chromebook', 'Computers', 204.99, 10000),
  -- (16, 'AIO Desktop', 'Computers', 599.99, 10000),
  -- (17, 'Laptop', 'Computers', 699.99, 10000),
  -- (18, 'Monitor 24 inch', 'Computers', 199.99, 10000),
  -- (19, 'Desktop', 'Computers', 669.99, 10000),
  -- (20, 'MacBook Air', 'Computers', 749.99, 10000),
  -- (21, 'MacBook Air Retina', 'Computers', 1026.99, 10000),
  -- (22, 'iMac', 'Computers', 695, 10000),
  -- (23, 'MacBook Pro Retina', 'Computers', 1199.99, 10000),
  -- (24, 'MacBook Pro 15 inch Retina', 'Computers', 2099.99, 10000),
  -- (25, 'iPad Pro', 'Computers', 674.99, 10000),
  -- (26, 'iPad Air', 'Computers', 469.99, 10000);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-08-25  9:00:47
