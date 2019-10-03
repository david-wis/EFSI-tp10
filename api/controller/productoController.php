<?php
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Allow: GET, POST, OPTIONS, PUT, DELETE");

    require_once('../dao/productoDao.php');
    $action = isset($_POST['action']) ? $_POST['action'] : $_GET['action'];
    switch ($action) {
        case 'agregar':
            /*  ProductoController no tiene relacion con 
             *  la clase producto, por lo tanto usamos un array asociativo
             */
            $producto = array(); 
            $producto["nombre"] = $_POST['nombre'];
            $producto["descripcion"] = $_POST['descripcion'];
            $producto["imagen"] = $_POST['imagen'];
            $producto["precio"] = $_POST['precio'];
            $producto["stock"] = $_POST['stock'];
            ProductoDao::AgregarProducto($producto);
            break;
        case 'modificar':
            $producto = array();
            $producto["nombre"] = $_POST['nombre'];
            $producto["descripcion"] = $_POST['descripcion'];
            $producto["imagen"] = $_POST['imagen'];
            $producto["precio"] = $_POST['precio'];
            $producto["stock"] = $_POST['stock'];
            ProductoDao::ModificarProducto($producto);
            break;
        case 'eliminar':
            ProductoDao::EliminarProducto($_POST['nombre']);
            break;
        case 'obtenerTodos':
            $productos = ProductoDao::ObtenerTodos();
            echo json_encode($productos);
            break;
        case 'obtenerUno':
            $producto = ProductoDao::ObtenerProducto($_POST['nombre']);
            echo json_encode($producto);
        default:
            $respuesta["error"] = "Comando invalido";
            echo json_encode($respuesta);
            break;
    }
?>