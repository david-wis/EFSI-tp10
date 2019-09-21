-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 21-09-2019 a las 23:37:41
-- Versión del servidor: 10.3.16-MariaDB
-- Versión de PHP: 7.1.30

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

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_EliminarProducto` (IN `pNom` VARCHAR(255))  NO SQL
BEGIN
	SET @ID = (SELECT ID from productos WHERE Nombre = pNom);
    DELETE FROM productos WHERE @ID=ID;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_ModificarProducto` (IN `pNom` VARCHAR(255), IN `pDesc` TEXT, IN `pImg` BLOB, IN `pPrec` FLOAT, IN `pSto` INT)  NO SQL
BEGIN
	SET @ID = (SELECT ID FROM productos WHERE Nombre = pNom);
    UPDATE productos 
    SET Nombre=pNom, Descripcion=pDesc, Imagen=pImg, Precio=pPrec, Stock=pSto
    WHERE ID=@ID;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Descripcion` text NOT NULL,
  `Imagen` blob NOT NULL,
  `Precio` float NOT NULL,
  `Stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
