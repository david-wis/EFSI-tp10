<?php
    include_once('../model/producto.php');
    include_once('../db.php');
    include_once('../helpers.php');
    class ProductoDao {
        public static function AgregarProducto($producto){
            $result = true;
            $productoNuevo = new Producto();
            $result = $result && self::Validar(array($productoNuevo, 'setNombre'), $producto['nombre'], 'string'); 
            $result = $result && self::Validar(array($productoNuevo, 'setDescripcion'), $producto['descripcion'], 'string');
            $result = $result && self::Validar(array($productoNuevo, 'setImagen'), $producto['imagen']);
            $result = $result && self::Validar(array($productoNuevo, 'setPrecio'), $producto['precio'], 'float');
            $result = $result && self::Validar(array($productoNuevo, 'setStock'), $producto['stock'], 'int');
            if($result){
                $productoNuevo->convertirImgABlob();
                if (floor(strlen($productoNuevo->getImagen())/1024) < 64) { //El blob solo aguanta hasta 64kb
                    $bd = DB::Connect();
                    if (DB::AgregarProducto($bd, $productoNuevo)){
                        $result = Helpers::Resultado['Exito'];
                    }
                    else {
                        $result = Helpers::Resultado['NombreRepetido'];
                    }
                    DB::Disconnect($bd);
                } else {
                    $result = Helpers::Resultado['FotoGrande'];
                }
            } else {
                $result = Helpers::Resultado['Error'];
            }
            return $result;       
        }        

        public static function ModificarProducto($producto){
            $result = true;
            $productoModificado = new Producto();
            $result = $result && self::Validar(array($productoModificado, 'setNombre'), $producto['nuevonombre'], 'string'); 
            $result = $result && self::Validar(array($productoModificado, 'setDescripcion'), $producto['descripcion'], 'string');
            $result = $result && self::Validar(array($productoModificado, 'setImagen'), $producto['imagen']);
            $result = $result && self::Validar(array($productoModificado, 'setPrecio'), $producto['precio'], 'float');
            $result = $result && self::Validar(array($productoModificado, 'setStock'), $producto['stock'], 'int');
            if (isset($producto['nombre'])) {
                $result = $result && $producto['nombre'] != "";
            }
            if($result){
                $productoModificado->convertirImgABlob();
                if (floor(strlen($productoModificado->getImagen())/1024) < 64) { //El blob solo aguanta hasta 64kb
                    $bd = DB::Connect();
                    if (DB::ModificarProducto($bd, $producto['nombre'], $productoModificado)) {
                        $result = Helpers::Resultado['Exito'];
                    } else {
                        $result = Helpers::Resultado['NombreRepetido'];
                    }
                    DB::Disconnect($bd);
                } else {
                    $result = Helpers::Resultado['FotoGrande'];
                }
            } else {
                $result = Helpers::Resultado['Error'];
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

        private static function Validar(callable $setter, $valor, $tipo = null) {
            $exito = false;
            if (isset($valor)) {
                if ($tipo == 'string') { //Nombre - descripcion
                    if (trim($valor) != ""){
                        $setter($valor);
                        $exito = true;
                    }
                } else if ($tipo == 'float' || $tipo == 'int') { //Stock - precio
                    if (is_numeric($valor)) {
                        if ($valor >= 0) {
                            $setter($valor);
                            $exito = true;
                        }
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