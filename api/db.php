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
        try{
            $sth = $pdo->prepare("CALL sp_AgregarProducto(:nombre,:descripcion,:imagen,:precio,:stock)");
            $sth->bindParam(':nombre', $producto->nombre);
            $sth->bindParam(':descripcion', $producto->descripcion);
            $sth->bindParam(':imagen', $producto->imagen);
            $sth->bindParam(':precio', $producto->precio);
            $sth->bindParam(':stock', $producto->stock);
            $sth->execute();
        } catch (Exception $e) {
            echo "Fallo ".$e->getMessage();
        }
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

            //echo $nombre." ".$descripcion." ".$imagen." ".$precio." ".$stock." ".$nuevoNombre;
        } catch (Exception $e) {
            echo "Fallo ".$e->getMessage();
        }
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