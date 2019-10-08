<?php
    include_once('../model/producto.php');
    include_once('../db.php');
    class ProductoDao {
        public static function AgregarProducto($producto){
            $result = true;
            $productoNuevo = new Producto();
            $result = $result && Validar($productoNuevo->setNombre, $producto['nombre']); 
            $result = $result && Validar($productoNuevo->setDescripcion, $producto['descripcion']);
            $result = $result && Validar($productoNuevo->setImagen, $producto['imagen']);
            $result = $result && Validar($productoNuevo->setPrecio, $producto['precio']);
            $result = $result && Validar($productoNuevo->setStock, $producto['stock']);
            if($result){
                $bd = DB::Connect();
                DB::AgregarProducto($bd, $producto);
                DB::Disconnect($bd);
            }
            return $result;       
        }        

        public static function ModificarProducto($producto){
            $result = true;
            $productoModificado = new Producto();
            $result = $result && self::Validar(array($productoModificado, 'setNombre'), $producto['nuevonombre']); 
            $result = $result && self::Validar(array($productoModificado, 'setDescripcion'), $producto['descripcion']);
            $result = $result && self::Validar(array($productoModificado, 'setImagen'), $producto['imagen']);
            $result = $result && self::Validar(array($productoModificado, 'setPrecio'), $producto['precio']);
            $result = $result && self::Validar(array($productoModificado, 'setStock'), $producto['stock']);
            if (isset($producto['nombre'])) {
                $result = $result && $producto['nombre'] != "";
            }
            if($result){
                $productoModificado->convertirImgABlob();
                $bd = DB::Connect();
                DB::ModificarProducto($bd, $producto['nombre'], $productoModificado);
                DB::Disconnect($bd);
            }
            return $result;
        }

        public static function EliminarProducto($nombre){
            $result = false;
            if (isset($nombre)) {
                $bd = DB::Connect();
                DB::EliminarProducto($bd, $nombre);
                DB::Disconnect($bd);
                $result = true;
            }
            return $result;
        }

        public static function ObtenerProducto($nombre) {
            $result = null;
            if (isset($nombre)) {
                $bd = DB::Connect();
                $result = DB::ObtenerProducto($bd, $nombre);
                DB::Disconnect($bd);
            }
            return $result;
        }

        public static function ObtenerTodos() {
            $bd = DB::Connect();
            $results = DB::ObtenerTodos($bd);
            DB::Disconnect($bd);
            return $results;
        }

        private static function Validar(callable $setter, $valor) {
            $exito = false;
            if (isset($valor)) {
                if (is_string($valor)) { //Nombre - descripcion
                    if (trim($valor) != ""){
                        $setter($valor);
                        $exito = true;
                    }
                } else if (is_numeric($valor)) { //Stock - precio
                    if ($valor >= 0) {
                        $setter($valor);
                        $exito = true;
                    }
                } else { // Imagen (blob)
                    $setter($valor);
                    $exito = true;
                }
            }
            return $exito;
        }
    }
?>