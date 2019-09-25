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
            return $result;       
        }

        private static function Validar(&$setter, $valor) {
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

        public static function ModificarProducto($producto){

        }

        public static function EliminarProducto($nombre){
            
        }

        public static function ObtenerProducto($nombre) {

        }

        public static function ObtenerTodos() {

        }
    }
?>