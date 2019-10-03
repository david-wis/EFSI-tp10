<?php
    class Producto implements JsonSerializable {
        private $Nombre;
        private $Descripcion;
        private $Imagen;
        private $Precio;
        private $Stock;
        
        public function getNombre(){
            return $this->Nombre;
        }

        public function setNombre($nombre){
            $this->Nombre = $nombre;
        }
    
        public function getDescripcion(){
            return $this->Descripcion;
        }

        public function setDescripcion($descripcion){
            $this->Descripcion = $descripcion;
        }
    
        public function getImagen(){
            return $this->Imagen;
        }

        public function setImagen($imagen){
            $this->Imagen = $imagen;
        }
        
        public function getPrecio(){
            return $this->Precio;
        }

        public function setPrecio($precio){
            $this->Precio = $precio;
        }
    
        public function getStock(){
            return $this->Stock;
        }

        public function setStock($stock){
            $this->Stock = $stock;
        }

        public function jsonSerialize() {
            $array = array( "Nombre" => $this->Nombre,
                            "Descripcion" => $this->Descripcion,
                            "Imagen" => base64_encode($this->Imagen),
                            "Precio" => $this->Precio,
                            "Stock" => $this->Stock
            );
            return $array;
        }
    }
?>