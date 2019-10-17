import React from 'react';
//import './App.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import $ from "jquery";
import Producto from "./Producto.js";

class Tabla extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      pages: null,
      loading: true,
      pagNueva: false
    };
    this.fetchData = this.fetchData.bind(this);
    this.renderEditable = this.renderEditable.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.eliminarClick = this.eliminarClick.bind(this);
    this.agregarProducto = this.agregarProducto.bind(this);
  }
 
  fetchData(state, instance){
    this.setState({loading: true});
    $.ajax({
      url: 'http://localhost/tp10/api/controller/productoController.php?action=obtenerTodos',
      dataType: "json"
    }).done((data) =>{
      this.setState({
        data: data,
        pages: data.length,
        loading: false
      });
    });
  }

  actualizarTabla(valor, index, idCol) {
    //El increible poder del spread salva el dia
    let producto = {...this.state.data[index], Nuevonombre: this.state.data[index].Nombre};
    if (idCol === "Nombre")  {
      producto.Nuevonombre = valor;
    } else {
      producto[idCol] = valor;
    }
    
    this.modificarTabla(producto, index);
  }

  handleImageChange(btn, index) {
    let data = [...this.state.data];
    let archivo = btn.files[0];
    let reader  = new FileReader();
    reader.onloadend = () => {
      let producto = {...this.state.data[index], Nuevonombre: this.state.data[index].Nombre};
      producto.Imagen = reader.result.substring(23); //Recortamos el data:image/jpeg;base64,
      if (!(this.state.pagNueva && index === data.length-1)) {
        this.modificarTabla(producto, index);
      } else {
        data[index] = producto;
        this.setState({data: data});
      }
      
    }
    if (archivo) {
      reader.readAsDataURL(archivo);
    }
  }

  modificarTabla(producto, index) {
    $.ajax({
      url: 'http://localhost/tp10/api/controller/productoController.php?action=modificar',
      method: 'POST',
      dataType: "json",
      data: producto
    }).done((result, textStatus, jqXHR) => {
      if (result.status === "success") {
        console.log("Exito al actualizar los datos ");
        console.log(result);
        let data = [...this.state.data];
        producto.Nombre = producto.Nuevonombre;
        data[index] = producto;
        this.setState({data: data});
      } else {
        console.log(result);
        this.setState({data: this.state.data});
      }
    }).fail((jqXHR, textStatus, errorThrown) => {
      console.log("Error al actualizar los datos: " + jqXHR.responseText);
      this.setState({data: this.state.data});
    });
  }

  validarFila(index) { //Se fija que todos los campos esten llenos
    let exito = true;
    for (let prop in this.state.data[index]) {
      exito = exito && (this.state.data[index][prop] !== "");
    }
    return exito;
  }

  agregarProducto(index) {
    if (this.validarFila(index)) {
      alert("OK");
    } else {
      alert("No ok");
    }
  }


  renderEditable(cellInfo) {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          /*let data = [...this.state.data];
          const nomViejo = data[cellInfo.index].Nombre;
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;*/
          let data = [...this.state.data];
          if (!(this.state.pagNueva && cellInfo.index === data.length-1)) {
            this.actualizarTabla(e.target.innerHTML, cellInfo.index, cellInfo.column.id);
          } else {
            let producto = data[cellInfo.index];
            producto[cellInfo.column.id] = e.target.innerHTML;
            data[cellInfo.index] = producto;
            this.setState({data: data});
          }     
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id]
        }}
        key={Date()} //Arregla el bug del dangerouslySetinnerHTML
      />
    );
  }

  eliminarClick(index) {
    let data = [...this.state.data];
    let nombre = data[index].Nombre;
    data.splice(index, 1);
    this.setState({data: data});

    if (!(this.state.pagNueva && index === data.length-1)) {
      $.ajax({
        url: 'http://localhost/tp10/api/controller/productoController.php?action=eliminar',
        method: "POST",
        data: {nombre: nombre}
      }).done(() =>{
        console.log("Borrado en la API exitoso");
      });
    }
  }

  render() {
    const { data, pages, loading } = this.state;
    return (
      <div>
        <ReactTable
          columns={[
            {
              Header: "Nombre",
              accessor: "Nombre",
              Cell: this.renderEditable
            },
            {
              Header: "Descripcion",
              accessor: "Descripcion",
              Cell: this.renderEditable
            },
            {
              Header: "Imagen",
              Cell: (row) => {
                //console.log(row.value);
                return (
                  <div>
                    <img style={{display: "block"}} width="100" height="100" alt="Foto no encontrada" src={"data:image/jpeg;base64,"+row.value}></img>
                    <input style={{display: "block"}} type="file" onChange={(e) => {this.handleImageChange(e.target, row.index)}} accept='.jpg'/>
                  </div>
                );
              },
              accessor: "Imagen"
            },
            {
              Header: "Precio",
              accessor: "Precio",
              Cell: this.renderEditable
            },
            {
              Header: "Stock",
              accessor: "Stock",
              Cell: this.renderEditable
            },
            {
              Header: "",
              Cell: (row) => {
                let visibilidad = "none";
                if (this.state.data[row.index].btnEliminar) {
                  visibilidad = this.state.data[row.index].btnEliminar;
                }
                return (
                  <div>
                    <i style={{display: visibilidad}} onClick={_ => {this.agregarProducto(row.index)}} class="material-icons" data-toggle="tooltip" title="OK">done</i>
                    <i onClick={_ => {this.eliminarClick(row.index)}} class="material-icons" data-toggle="tooltip" title="Eliminar">&#xE872;</i>
                  </div>
                );
              }
            }
          ]}
          data={data}
          pages={pages} // Display the total number of pages
          loading={loading} // Display the loading overlay when we need it
          onFetchData={this.fetchData} // Request new data when things change
          defaultPageSize={5}
          className="-striped -highlight"
          getTdProps={(state, rowInfo, column, instance) => {
            return {
              onClick: (e, handleOriginal) => {
                if (rowInfo === undefined) {
                  if (!this.state.pagNueva){
                    let prod = new Producto();
                    prod.btnEliminar = "visible";
                    Producto.ObtenerFotoDefault().then(base64img => {
                      prod.Imagen = base64img;
                      const data = [...this.state.data, prod];
                      this.setState({data: data, pagNueva: true});
                    });
                  }
                }
                if (handleOriginal) {
                  handleOriginal();
                }
              }
            }
          }}
        />
        <br />
      </div>
    );
  }
}
export default Tabla;
