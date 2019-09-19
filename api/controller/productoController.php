<?php
    include_once('../dao/productoDao.php');
    $action = isset($_POST['action']) ? $_POST['action'] : $_GET['action'];
    switch ($action) {
        case 'agregar':
            $producto = new Producto();
            $producto->nombre = $_POST['nombre'];
            $producto->descripcion = $_POST['descripcion'];
            $producto->imagen = $_POST['imagen'];
            $producto->precio = $_POST['precio'];
            $producto->stock = $_POST['stock'];
            break;
        case 'modificar':
            $producto = new Producto();
            $producto->nombre = $_POST['nombre'];
            $producto->descripcion = $_POST['descripcion'];
            $producto->imagen = $_POST['imagen'];
            $producto->precio = $_POST['precio'];
            $producto->stock = $_POST['stock'];
            break;
        case 'eliminar':
            $producto = new Producto();
            $producto->nombre = $_POST['nombre'];
            break;
        
        default:
            # code...
            break;
    }
?>