import { BigNumber } from 'ethers';
import React from 'react';
import { Button, Container, Card, Image, Modal, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { LandModel } from '../../contract/dist/src/services/splitService';
import { appService } from '../components/services';
import { useSafeState, useAlert, ALERT_TIMEOUT } from './hooks';
type OfferDetailState = {
    submitting?: boolean
    modal?: "withdraw" | "withdraw-cant"
}

type OfferDetailsProps = {
    land: LandModel<string>
    balance: BigNumber
    currentUser:string
    locked:string
    onWithdraw(): void
}
export default function OfferDetails({ locked, land, balance, currentUser, onWithdraw }: OfferDetailsProps) {
    const [state, setState] = useSafeState<OfferDetailState>({ });
    const [alert, _, showAlert] = useAlert();
    const utilService = appService.utilService;
    const percent = () => {
        return utilService.fromPrecision(balance.div(land?._supply!).mul(100))
    }
    const onShowWithdraw = () => {
        const totalSupply = utilService.toPrecision(land?._supply!);
        if (balance.lt(totalSupply)) {
            setState((state) => ({ ...state, modal: "withdraw-cant" }))
        } else {
            setState((state) => ({ ...state, modal: "withdraw" }))
        }
    }
    const onWithdrawSubmit = async () => {
        try {
            setState((state) => ({ ...state, submitting: true }))
            await appService.metaService.withdrawLand(land._address);
            showAlert({ type: "success", message: "Land has been withdrawed!", show: true });
            onWithdraw();
        } catch (e) {
            let message = utilService.formatError(e);
            showAlert({ type: "danger", message, show: true })
        } finally {
            setState((state) => ({ ...state, submitting: false }))
            onHideWithdraw();
        }
    }
    const onHideWithdraw = () => {
        setState((state) => ({ ...state, modal: undefined }))
    }
    const canWithdraw = () => {
        const supply = utilService.toPrecision(land._supply);
        return balance.eq(supply);
    }
    return <><Container className="p-3 d-flex flex-column align-items-center justify-content-between flex-lg-row align-items-lg-start">
        <Image fluid src={land._meta?.image} className="col-12 col-md-8 col-lg-6 rounded" />
        {/*!showForm && */<Container className="d-flex flex-column col-12 col-md-8 col-lg-6 mt-4 mt-lg-0 ms-lg-4">
            <Card.Text className="d-flex flex-column text-dark">
                <b className="text-dark my-2">Initial Owner</b>
                <small className="text-muted">{land?._owner}</small>
                <b className="text-dark my-2">Initial Contract</b>
                <small className="text-muted">{land?._nftaddr}</small>
                <b className="text-dark my-2">Token ID</b>
                <small className="text-muted">{land?._nftid.toString()} ({land?._erc721 ? "ERC21" : "ERC1155"})</small>
                <b className="text-dark my-2">My Participation</b>
                <small className="text-muted">{utilService.fromPrecision(balance!)}/{land._supply.toString()} PARTS available <b>({percent()}% of the supply)</b></small>
                <small className="text-muted">{locked} PARTS locked in orders</small>
                <b className="text-dark my-2">Description</b>
                <small className="text-muted">{land._meta.description}</small>
            </Card.Text>
            <Button variant="outline-danger" className="w-100 text-center my-2" disabled={!canWithdraw()} onClick={onShowWithdraw}>WITHDRAW</Button>
        </Container>}
        {/*showForm && <Container className="d-flex flex-column col-12 col-md-8 col-lg-6 mt-4 mt-lg-0 ms-lg-4">
            <OfferForm land={land} onFormCancel={() => onCancelForm(false)} onFormSave={() => onCancelForm(true)} />
</Container>*/}
    </Container>

        <Modal onHide={onHideWithdraw} centered show={state.modal == "withdraw-cant"}>
            <Modal.Body className="text-primary d-flex flex-column text-center py-4 px-5">
                <p className="mb-3 text-dark">NOT ENOUGH PARTS</p>
                <p className="mb-4 text-muted">To withdraw an NFT you need to own 100% of the parts</p>
                <Button onClick={onHideWithdraw} href="#" as="a" variant="secondary" size="lg" className="me-md-1 flex-grow-1">OK</Button>
            </Modal.Body>
        </Modal>
        <Modal onHide={onHideWithdraw} centered show={state.modal == "withdraw"}>
            <Modal.Body className="text-mutex d-flex flex-column text-center py-4 px-5">
                <p className="mb-3 text-dark">WITHDRAW</p>
                <p className="mb-4">You are goind to withdraw your land from the platform.<br/>Are you sure?</p>
                <small>Receiver: {currentUser}</small>
                <Container className="d-flex align-items-center justify-content-between p-0 pb-3 pt-3">
                    <Button onClick={onHideWithdraw} href="#" as="a" variant="light" size="lg" className="me-md-1 mb-2 mt-1 flex-grow-1">CANCEL</Button>
                    <Button className="d-flex flex-row justify-content-center flex-grow-1" variant="danger" size="lg" onClick={onWithdrawSubmit} disabled={state.submitting}>
                        <span>
                            {state.submitting && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" className="me-1" />}
                            <span>WITHDRAW</span>
                        </span>
                    </Button>
                </Container>
            </Modal.Body>
        </Modal>

        <ToastContainer position="middle-center" className="position-fixed" >
            <Toast onClose={() => showAlert({ show: false })} show={alert.show} delay={ALERT_TIMEOUT} autohide bg={alert.type && alert.type.toLowerCase()}>
                <Toast.Body>{alert.message}</Toast.Body>
            </Toast>
        </ToastContainer>
    </>;
}