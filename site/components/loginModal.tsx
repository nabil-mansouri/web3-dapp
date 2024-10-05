import React, { MouseEvent } from 'react';
import { Container, Toast, Card, Image, Spinner, ListGroup, Modal } from 'react-bootstrap';
import NavbarComponent from "./navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { appService } from './services';
import { ToastContainer } from 'react-bootstrap';
import { useAlert, useSafeState, ALERT_TIMEOUT } from './hooks';

type LoginState = { loading: boolean }
const LoginModal = (props: { onSuccess(): void, loading: boolean }) => {
    const [alert, _, showAlert] = useAlert();
    const [state, setState] = useSafeState<LoginState>({ loading: false });
    const open = (url: string) => {
        return (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            return window.open(url, '_blank')
        };
    }
    const connect = (type: "walletconnect" | "injected") => {
        return async (e: MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();
            try {
                setState({ loading: true });
                await appService.web3Service.connect(type);
                //showAlert({ type: "success", message: "Authenticated successfully", show: true })
                props.onSuccess()
            } catch (e) {
                console.error(e);
                showAlert({ type: "danger", message: `${(e as any).message || e}`, show: true })
            } finally {
                setState({ loading: false });
            }
        }
    }
    const loading = state.loading || props.loading;
    const onReload=()=>{}
    return <>
        <NavbarComponent onReload={onReload}/>
        <Modal show={true} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Body>
                {!loading ?
                    <ListGroup as="ol" className="list-group-flush pointer">
                        <ListGroup.Item action onClick={connect("injected")} as="li" className="pb-3 pt-3">
                            <p className="text-center d-flex flex-column align-items-center">
                                <Image src="/assets/images/metamask.svg" className="me-3" width={40} height={40} />
                                <b>Metamask</b>
                                <span className="text-muted">Connect to your MetaMask Wallet</span>
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item action onClick={connect("injected")} as="li" className="pb-3 pt-3">
                            <p className="text-center d-flex flex-column align-items-center">
                                <Image src="/assets/images/trustwallet.svg" className="me-3" width={40} height={40} />
                                <b>Trust Wallet</b>
                                <span className="text-muted">Connect using Trust Wallet</span>
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item action onClick={connect("walletconnect")} as="li" className="pb-3 pt-3">
                            <p className="text-center d-flex flex-column align-items-center">
                                <Image src="/assets/images/walletconnect.svg" className="me-3" width={40} height={40} />
                                <b>Wallet Connect</b>
                                <span className="text-muted">Connect using Wallet Connect</span>
                            </p>
                        </ListGroup.Item>
                    </ListGroup>
                    :
                    <ListGroup as="ol" className="list-group-flush pointer">
                        <ListGroup.Item action as="li" className="d-flex align-items-center justify-content-center pb-3 pt-3">
                            <Spinner animation="grow" />
                        </ListGroup.Item>
                    </ListGroup>
                }
            </Modal.Body>
        </Modal>
        <ToastContainer position="middle-center" className="position-fixed" >
            <Toast onClose={() => showAlert({ show: false })} show={alert.show} delay={ALERT_TIMEOUT} autohide bg={alert.type && alert.type.toLowerCase()}>
                <Toast.Body>{alert.message}</Toast.Body>
            </Toast>
        </ToastContainer>
    </>;
}
export default LoginModal;
