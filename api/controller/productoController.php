<?php
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Allow: GET, POST, OPTIONS, PUT, DELETE");

    require_once('../dao/productoDao.php');
    include_once('../helpers.php');
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
            $resultado = ProductoDao::AgregarProducto($producto);
            if ($resultado == Helpers::Resultado['Exito']) {
                echo json_encode(array("status" => 'success'));
            } else if ($resultado == Helpers::Resultado['Error']) {
                echo json_encode(array("status" => 'error', "msg" => 'El dato ingresado no es valido'));
            } else if ($resultado == Helpers::Resultado['FotoGrande']){
                echo json_encode(array("status" => 'error', "msg" => 'La foto es demasiado grande'));
            } else {
                echo json_encode(array("status" => 'error', "msg" => 'El nombre ya existe'));
            }
            break;
        case 'modificar':
            $producto = array();
            $producto["nombre"] = $_POST['Nombre'];
            $producto["descripcion"] = $_POST['Descripcion'];
            $producto["imagen"] = $_POST['Imagen'];
            $producto["precio"] = $_POST['Precio'];
            $producto["stock"] = $_POST['Stock'];
            $producto["nuevonombre"] = $_POST['Nuevonombre'];
            $resultado = ProductoDao::ModificarProducto($producto);
            if ($resultado == Helpers::Resultado['Exito']) {
                echo json_encode(array("status" => 'success'));
            } else if ($resultado == Helpers::Resultado['Error']) {
                echo json_encode(array("status" => 'error', "msg" => 'El dato ingresado no es valido'));
            } else if ($resultado == Helpers::Resultado['FotoGrande']){
                echo json_encode(array("status" => 'error', "msg" => 'La foto es demasiado grande'));
            } else {
                echo json_encode(array("status" => 'error', "msg" => 'El nombre ya existe'));
            }
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
            break;
        case 'obtenerImgDefault':
            $imagen = file_get_contents('../content/img_muestra.jpg');
            echo base64_encode($imagen);
            break;
        default:
            $respuesta["error"] = "Comando invalido";
            echo json_encode($respuesta);
            break;
    }
?>