import React from 'react';
//import './App.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import $ from "jquery";
import Producto from "./Producto.js";
import ModalMsg from "./ModalMsg.js";
import {ImgUploader, Botoncitos, setEndOfContenteditable, validarFila} from './Helpers.js';

class Tabla extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      loading: true,
      prodNuevo: false,
      ultimaCeldaModificada: null,
      showModal: false,
      msg: ""
    };
    this.celdas = []; //refs a todas las celdas
    this.fetchData = this.fetchData.bind(this);
    this.renderEditable = this.renderEditable.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.eliminarClick = this.eliminarClick.bind(this);
    this.agregarProducto = this.agregarProducto.bind(this);
  }
 
  fetchData(state, instance){
    this.setState({loading: true, prodNuevo: false});
    $.ajax({
      url: 'http://localhost/tp10/api/controller/productoController.php?action=obtenerTodos',
      dataType: "json"
    }).done((data) =>{
      data.forEach(producto => {
        this.celdas.push([]);
      });
      this.setState({data: data, loading: false});
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
      if (!(this.state.prodNuevo && index === data.length-1)) {
        this.modificarTabla(producto, index);
      } else {
        data[index] = producto;
        this.setState({showModal: false}, () => {
          this.setState({data: data});
        });
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
        this.setState({showModal: false}, () => {
          this.setState({data: data}); 
        });
      } else {
        console.log(result);
        this.setState({data: this.state.data, showModal: true, msg: result.msg});
        this.setState({data: this.state.data});
      }
    }).fail((jqXHR, textStatus, errorThrown) => {
      console.log("Error al actualizar los datos: " + jqXHR.responseText);
      this.setState({data: this.state.data, showModal: true, msg: jqXHR.responseText});
    });
  }

  agregarProducto(index) {
    let data = [...this.state.data];
    if (validarFila(index, data)) {
      let producto = data[index];
      $.ajax({
        url: 'http://localhost/tp10/api/controller/productoController.php?action=agregar',
        method: 'POST',
        dataType: "json",
        data: producto
      }).done((result, textStatus, jqXHR) => {
        if (result.status === "success") {
          console.log("Exito al actualizar los datos ");
          producto.Nuevo = false;
          data[index] = producto;
          this.setState({showModal: false}, () => {
            this.setState({data: data, prodNuevo: false});
          });
          console.log(result);
        } else {
          console.log(result);
          this.setState({data: this.state.data, showModal: true, msg: result.msg});
        }
      }).fail((jqXHR, textStatus, errorThrown) => {
        console.log("Error al actualizar los datos: " + jqXHR.responseText);
        this.setState({data: this.state.data, showModal: true, msg: jqXHR.responseText});
      });
    } else {
      this.setState({showModal: true, msg: "Falto algun dato"});
    }
  }

  renderEditable(cellInfo) {
    return (
      <div
        ref={(ref) => {
            if (this.celdas[cellInfo.index] !== undefined) { //Evitar referencias a objetos borrados
              this.celdas[cellInfo.index][cellInfo.column.id] = ref;
            }
          }
        }
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          let data = [...this.state.data];
          if (!(this.state.prodNuevo && cellInfo.index === data.length-1)) {
            this.actualizarTabla(e.target.innerHTML, cellInfo.index, cellInfo.column.id);
          }
        }}

        onInput={e => {
          let data = [...this.state.data];
          if (this.state.prodNuevo && cellInfo.index === data.length-1) {
            let producto = data[cellInfo.index];
            producto[cellInfo.column.id] = e.target.innerHTML;
            data[cellInfo.index] = producto;
            let ultimaCeldaModificada = [cellInfo.index, cellInfo.column.id];
            this.setState({showModal: false}, () => {
              this.setState({data: data, ultimaCeldaModificada: ultimaCeldaModificada});
            });
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

    if (!(this.state.prodNuevo && index === data.length-1)) {
      $.ajax({
        url: 'http://localhost/tp10/api/controller/productoController.php?action=eliminar',
        method: "POST",
        data: {nombre: nombre}
      }).done(() =>{
        console.log("Borrado en la API exitoso");
      });
    } else {
      this.setState({prodNuevo: false});
    }
    
    data.splice(index, 1);
    this.setState({showModal: false}, () => {
      this.setState({data: data});
    });
    this.celdas.splice(index);
  }

  //Magia de bajo nivel para que el cursor se ponga donde se tiene que poner cuando se editan los contenteditables
  componentDidUpdate() {
    let {ultimaCeldaModificada} = this.state;
    if (ultimaCeldaModificada != null) {
      try {
        let contentEditableElement = this.celdas[ultimaCeldaModificada[0]][ultimaCeldaModificada[1]]; 
        contentEditableElement.focus(); //Recuperamos el focus en la celda donde se produjo el oninput
        setEndOfContenteditable(contentEditableElement); //Ponemos el cursor al final
      } catch (e) {
        console.log(e);
      }
      ultimaCeldaModificada = null; //Ya no es necesario volver a focusear nada la próxima
      this.setState({ultimaCeldaModificada: ultimaCeldaModificada});
    }
  }

  render() {
    const { data, loading} = this.state;
    return (
      <div>
      <ModalMsg showModal={this.state.showModal} msg={this.state.msg} />
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
                return <ImgUploader img64={row.value} handleImageChange={(e) => {this.handleImageChange(e.target, row.index)}}/>;
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
                return <Botoncitos 
                          nuevo={data[row.index].Nuevo} 
                          agregarProducto={_ => {this.agregarProducto(row.index)}} 
                          eliminarClick={_ => {this.eliminarClick(row.index)}}
                        />;
              }
            }
          ]}
          data={data}
          loading={loading} // Display the loading overlay when we need it
          onFetchData={this.fetchData} // Request new data when things change
          defaultPageSize={5}
          //pages={pages} // Display the total number of pages
          className="-striped -highlight"
          getTdProps={(state, rowInfo, column, instance) => {
            return {
              onClick: (e, handleOriginal) => {
                if (rowInfo === undefined) {
                  if (!this.state.prodNuevo){
                    this.setState({showModal: false}, () => {
                      this.celdas.push([]);
                      let prod = new Producto();
                      Producto.ObtenerFotoDefault().then(base64img => {
                        prod.Imagen = base64img;
                        const data = [...this.state.data, prod];
                        this.setState({data: data, prodNuevo: true, showModal: false});
                      });
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
