import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default class ModalMsg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.showModal,
      msg: this.props.msg
    };
  };

  componentWillReceiveProps(newProps) {
    this.setState({
      show: newProps.showModal,
      msg: newProps.msg
    });
  }

  ocultarModal = () => {
    this.setState({show: false});
  }

  render() {
    return (
      <Modal show={this.state.show} animation={true} onHide={this.ocultarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.state.msg}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.ocultarModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}