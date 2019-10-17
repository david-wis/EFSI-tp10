<?php
require_once('model/producto.php');

class DB {
    public static function Connect() {
        try {
            $pdo = new PDO("mysql:host=127.0.0.1;dbname=tp10", "root", "");
            return $pdo;
        } catch (Exception $e) {
            die("No se puedo conectar: ".$e->getMessage());
        }
    }

    public static function AgregarProducto($pdo, $producto) {
        $exito = true;
        try{
            $sth = $pdo->prepare("CALL sp_AgregarProducto(:nombre,:descripcion,:imagen,:precio,:stock)");
            
            $nombre = $producto->getNombre();
            $descripcion = $producto->getDescripcion();
            $imagen = $producto->getImagen();
            $precio = $producto->getPrecio();
            $stock = $producto->getStock();

            $sth->bindParam(':nombre', $nombre);
            $sth->bindParam(':descripcion', $descripcion);
            $sth->bindParam(':imagen', $imagen);
            $sth->bindParam(':precio', $precio);
            $sth->bindParam(':stock', $stock);
            $sth->execute();

            $result = $sth->fetch(PDO::FETCH_ASSOC);
            if ($result) {
                if (array_key_exists('Error', $result)){
                    $exito = false;
                }
            }
        } catch (Exception $e) {
            echo "Fallo ".$e->getMessage();
        }
        return $exito;
    }

    public static function EliminarProducto($pdo, $nombre) {
        try{
            $sth = $pdo->prepare("CALL sp_EliminarProducto(:nombre)");
            $sth->bindParam(':nombre', $nombre);
            $sth->execute();
        } catch (Exception $e) {
            echo "Fallo ".$e->getMessage();
        }
    }

    public static function ModificarProducto($pdo, $nombre, $producto) {
        $exito = true;
        try{
            $sth = $pdo->prepare("CALL sp_ModificarProducto(:nombre,:descripcion,:imagen,:precio,:stock,:nuevoNom)");

            $descripcion = $producto->getDescripcion();
            $imagen = $producto->getImagen();
            $precio = $producto->getPrecio();
            $stock = $producto->getStock();
            $nuevoNombre = $producto->getNombre();

            $sth->bindParam(':nombre', $nombre);
            $sth->bindParam(':descripcion', $descripcion);
            $sth->bindParam(':imagen', $imagen);
            $sth->bindParam(':precio', $precio);
            $sth->bindParam(':stock', $stock);
            $sth->bindParam(':nuevoNom', $nuevoNombre);
            $sth->execute();

            $result = $sth->fetch(PDO::FETCH_ASSOC);
            if ($result) {
                if (array_key_exists('Error', $result)){
                    $exito = false;
                }
            }   
        } catch (Exception $e) {
            echo "Fallo ".$e->getMessage();
        }
        return $exito;
    }

    public static function ObtenerProducto($pdo, $nombre) {
        $producto = null;
        try{
            $sth = $pdo->prepare("CALL sp_ObtenerProducto(:nombre)");
            $producto = $sth->bindParam(':nombre', $producto->nombre);
            $sth->execute();
        } catch (Exception $e) {
            echo "Fallo ".$e->getMessage();
        }
        return $producto;
    }

    public static function ObtenerTodos($pdo) {
        $productos = null;
        try{
            $result = $pdo->query("CALL sp_ObtenerProductos()");
            $productos = $result->fetchAll(PDO::FETCH_CLASS, 'producto');
        } catch (Exception $e) {
            echo "Fallo ".$e->getMessage();
        }
        return $productos;
    }
    
    public static function Disconnect(&$pdo) {
        $pdo = null;
    }
}

?>