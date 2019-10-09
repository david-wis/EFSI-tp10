import React from 'react';
//import './App.css';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import $ from "jquery";

class Tabla extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      pages: null,
      loading: true
    };
    this.fetchData = this.fetchData.bind(this);
    this.renderEditable = this.renderEditable.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
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

  actualizarTabla(nomViejo, index, data) {
    this.setState({data: data });
    let producto = {
      nombre: nomViejo, 
      descripcion: data[index].Descripcion, 
      imagen: data[index].Imagen, 
      precio: data[index].Precio, 
      stock: data[index].Stock, 
      nuevonombre: data[index].Nombre
    }
    this.modificarTabla(producto);
  }

  handleImageChange(event) {
    let btn = event.target;
    let archivo = btn.files[0];
    let id = btn.getAttribute('row-id');
    let reader  = new FileReader();
    let data = [...this.state.data];
    reader.onloadend = () => {
      data[id].Imagen = reader.result.substring(23);
      this.setState({data: data});
      /*
      let fila = btn.parentElement.parentElement.parentElement;
      let producto = {
        nombre: fila.children[0].firstChild.innerHTML,
        descripcion: fila.children[1].firstChild.innerHTML,
        imagen: reader.result.substring(23), //Le borramos el data:image/jpeg;base64,
        precio: fila.children[3].firstChild.innerHTML,
        stock: fila.children[4].firstChild.innerHTML,
        nuevonombre: fila.children[0].firstChild.innerHTML //Hacemos un poco de trampa por la causa
      };*/
      let producto = {
        nombre: data[id].Nombre, 
        descripcion: data[id].Descripcion, 
        imagen: data[id].Imagen, 
        precio: data[id].Precio, 
        stock: data[id].Stock, 
        nuevonombre: data[id].Nombre //Hacemos un poco de trampa por la causa
      }
      this.modificarTabla(producto);
    }
    if (archivo) {
      reader.readAsDataURL(archivo);
    }
  }

  modificarTabla(producto) {
    $.ajax({
      url: 'http://localhost/tp10/api/controller/productoController.php?action=modificar',
      method: 'POST',
      //dataType: "json",
      data: producto
    }).done((data, textStatus, jqXHR) => {
      if (data.status === "success") {
        console.log("Exito al actualizar los datos");
      } else {
        console.log(data);
      }
    }).fail((jqXHR, textStatus, errorThrown) => {
      console.log("Error al actualizar los datos " + errorThrown);
    });
  }

  renderEditable(cellInfo) {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.data];
          const nomViejo = data[cellInfo.index].Nombre;
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.actualizarTabla(nomViejo, cellInfo.index, data);
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
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
                    <input style={{display: "block"}} type="file" onChange={this.handleImageChange} row-id={row.index} accept='.jpg'/>
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
            }
          ]}
          data={data}
          pages={pages} // Display the total number of pages
          loading={loading} // Display the loading overlay when we need it
          onFetchData={this.fetchData} // Request new data when things change
          defaultPageSize={5}
          className="-striped -highlight"
        />
        <br />
      </div>
    );
  }
}
export default Tabla;
