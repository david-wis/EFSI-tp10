import fetch from 'node-fetch';

export default class Producto {
    constructor() {
        this.Nombre = "";
        this.Descripcion = "";
        this.Imagen = "";
        this.Precio = 0;
        this.Stock = 0;
    }

    static ObtenerFotoDefault = async() => {
        const promesa = await fetch('http://localhost/tp10/api/controller/productoController.php?action=obtenerImgDefault');
        return promesa.text();
    }
}