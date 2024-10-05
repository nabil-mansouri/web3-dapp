import React from "react";
import Modal from 'react-bootstrap/Modal';

const NetworkModal = (props:{ showNetwork: boolean, onHide:()=>void }) => {
  return <Modal onHide={props.onHide} show={props.showNetwork} size="lg" dialogClassName="max-500" aria-labelledby="contained-modal-title-vcenter" centered>
    <Modal.Header closeButton>
      <Modal.Title className="text-primary" as="h6">BAD NETWORK</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p className="text-muted">Please switch to the ETH mainnet network to use this application</p>
    </Modal.Body>
  </Modal>
};

export default NetworkModal;
