<?php
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
            $sth = $dbh->prepare("CALL sp_AgregarProducto(:nombre,:descripcion,:imagen,:precio,:stock)");
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
            $sth = $dbh->prepare("CALL sp_EliminarProducto(:nombre");
            $sth->bindParam(':nombre', $producto->nombre);
            $sth->execute();
        } catch (Exception $e) {
            echo "Fallo ".$e->getMessage();
        }
    }

    public static function ModificarProducto($pdo, $nombre, $producto) {
        try{
            $sth = $dbh->prepare("CALL sp_ModificarProducto(:nombre,:descripcion,:imagen,:precio,:stock,:nuevoNom)");
            $sth->bindParam(':nombre', $producto->nombre);
            $sth->bindParam(':descripcion', $producto->descripcion);
            $sth->bindParam(':imagen', $producto->imagen);
            $sth->bindParam(':precio', $producto->precio);
            $sth->bindParam(':stock', $producto->stock);
            $sth->bindParam(':nuevoNom', $nombre);
            $sth->execute();
        } catch (Exception $e) {
            echo "Fallo ".$e->getMessage();
        }
    }

    public static function ObtenerProducto($pdo, $nombre) {
        $producto = null;
        try{
            $sth = $dbh->prepare("CALL sp_ObtenerProducto(:nombre)");
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
            $productos = $pdo->exec("CALL sp_ObtenerTodos()");
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