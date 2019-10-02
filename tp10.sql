-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 02-10-2019 a las 11:58:37
-- Versión del servidor: 5.7.21
-- Versión de PHP: 5.6.35

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tp10`
--

DELIMITER $$
--
-- Procedimientos
--
DROP PROCEDURE IF EXISTS `sp_AgregarProducto`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_AgregarProducto` (IN `pNom` VARCHAR(255), IN `pDesc` TEXT, IN `pImg` BLOB, IN `pPrec` FLOAT, IN `pSto` INT)  NO SQL
BEGIN
	SET @Existe = (SELECT Nombre FROM productos WHERE Nombre = pNom);
    IF (@Existe IS NOT NULL)
    THEN
    	INSERT INTO productos (Nombre, Descripcion, Imagen, Precio, Stock) VALUES (pNom, pDesc, pImg, pPrec, pSto);
    ELSE
    	SELECT "El producto ya existe" AS Error;
    END IF;
END$$

DROP PROCEDURE IF EXISTS `sp_EliminarProducto`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_EliminarProducto` (IN `pNom` VARCHAR(255))  NO SQL
BEGIN
	SET @ID = (SELECT ID from productos WHERE Nombre = pNom);
    DELETE FROM productos WHERE @ID=ID;
END$$

DROP PROCEDURE IF EXISTS `sp_ModificarProducto`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ModificarProducto` (IN `pNom` VARCHAR(255), IN `pDesc` TEXT, IN `pImg` BLOB, IN `pPrec` FLOAT, IN `pSto` INT, IN `pNuevoNom` INT)  NO SQL
BEGIN
	SET @ID = (SELECT ID FROM productos WHERE Nombre = pNom);
    UPDATE productos 
    SET Nombre=pNuevoNom, Descripcion=pDesc, Imagen=pImg, Precio=pPrec, Stock=pSto
    WHERE ID=@ID;
END$$

DROP PROCEDURE IF EXISTS `sp_ObtenerProducto`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ObtenerProducto` (IN `pNom` VARCHAR(255))  NO SQL
BEGIN
	SET @Existe = (SELECT ID FROM productos WHERE Nombre = pNom);
    IF(@Existe IS NOT NULL)
    THEN
    	SELECT * FROM productos WHERE ID = @Existe;
    ELSE
    	Select "Producto no encontrado" AS Error;
   	END IF;
END$$

DROP PROCEDURE IF EXISTS `sp_ObtenerProductos`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ObtenerProductos` ()  NO SQL
BEGIN
	SELECT * FROM productos;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

DROP TABLE IF EXISTS `productos`;
CREATE TABLE IF NOT EXISTS `productos` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) NOT NULL,
  `Descripcion` text NOT NULL,
  `Imagen` blob NOT NULL,
  `Precio` float NOT NULL,
  `Stock` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
