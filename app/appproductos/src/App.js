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
  }
 
  fetchData(state, instance){
    this.setState({loading: true});
    $.ajax({
      url: 'http://localhost/tp10/api/controller/productoController.php?action=obtenerTodos',
      dataType: "json"
    }).done((data) =>{
      data.forEach(producto => {
        let img = new Image();
        img.src = producto.Imagen;
        producto.Imagen = img;
      });

      this.setState({
        data: data,
        pages: data.length,
        loading: false
      });
    });
  }

  render() {
    const { data, pages, loading } = this.state;
    return (
      <div>
        <ReactTable
          columns={[
            {
              Header: "Nombre",
              accessor: "Nombre"
            },
            {
              Header: "Descripcion",
              accessor: "Descripcion",
            },
            {
              Header: "Imagen",
              accessor: "Imagen"
            },
            {
              Header: "Precio",
              accessor: "Precio"
            },
            {
              Header: "Stock",
              accessor: "Stock"
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
