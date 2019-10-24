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
    this.state = {
      show: newProps.showModal,
      msg: newProps.msg
    };
  }

  render() {
    return (
      <>
        <Modal show={this.state.show} animation={false}>
          <Modal.Header>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.msg}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {this.setState({show: false});}}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}