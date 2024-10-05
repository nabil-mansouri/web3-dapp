import React from 'react';
import { Container, Form, InputGroup, FormControl, Spinner, Button, Toast, ToastContainer, Image, Card, Dropdown, DropdownButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { appService, formatNumber } from './services';
import { ALERT_TIMEOUT, useAlert, useSafeState, useAuthenticatedEffect } from './hooks';

type Contract = { name: string, address: string };
type ImportFormState = {
    loading: boolean,
    submitting?: boolean
    contractAddress: string
    tokenId: string
    supply: string
    showContractInput?: boolean
    sources: Array<Contract>
}
const ImportForm = ({ onFormCancel, onFormSave }: { onFormCancel?(): void, onFormSave?(Import: ImportFormState): void }) => {
    const { utilService } = appService;
    const [alert, _, showAlert] = useAlert();
    const [state, setState] = useSafeState<ImportFormState>({ loading: true, contractAddress: "", tokenId: "", supply: "", sources: [] });
    const reload = async () => {
        const sources = [...appService.appConf.landContracts];
        setState((state) => ({ ...state, loading: false, sources }))
    }
    useAuthenticatedEffect(() => {
        reload();
    }, [])
    const onChangeSmartContract = (contract: Contract) => {
        if (contract.address == utilService.ZERO_ADDRESS) {
            setState((state) => ({ ...state, showContractInput: true }))
        } else {
            setState((state) => ({ ...state, showContractInput: false, contractAddress: contract.address }))
        }
    }
    const onChangeAddress = (address: string) => {
        setState((state) => ({ ...state, contractAddress: address }))
    }
    const onChangeID = (tokenId: string) => {
        setState((state) => ({ ...state, tokenId }))
    }
    const onChangeSupply = (supply: string) => {
        let res = formatNumber(supply);
        if (res === false) {
            return;
        }
        setState((state) => ({ ...state, supply:res as any }))
    }
    const canSubmit = (stateParam?: ImportFormState) => {
        const { contractAddress, supply, tokenId } = stateParam || state;
        return contractAddress && (+supply) > 0 && tokenId;
    }
    const onSubmit = async () => {
        if (!canSubmit()) {
            return;
        }
        try {
            const { contractAddress, supply, tokenId } = state;
            setState((state) => ({ ...state, submitting: true }))
            await appService.metaService.partitionLand(contractAddress, tokenId, supply);
            showAlert({ type: "success", message: "Land has been imported!", show: true })
            onFormSave && onFormSave(state);
        } catch (e) {
            let message = utilService.formatError(e);
            showAlert({ type: "danger", message, show: true })
        } finally {
            setState((state) => ({ ...state, submitting: false }))
        }
    }
    const onFakeMint = async () => {
        try {
            setState((state) => ({ ...state, loading: true }))
            const newId = await appService.metaService.findNewId();
            const tokenId = await appService.metaService.mintFakeLand(1,newId.newX, newId.y);
            const contractAddress = appService.fakeLandContract.address;
            setState((state) => ({ ...state, tokenId: tokenId.toString(), contractAddress, showContractInput: false }))
            showAlert({ type: "success", message: "Land has been minted!", show: true })
        } catch (e) {
            let message = utilService.formatError(e);
            showAlert({ type: "danger", message, show: true })
        } finally {
            setState((state) => ({ ...state, loading: false }))
        }
    }
    const { contractAddress, loading, sources, supply, tokenId, showContractInput, submitting } = state;
    const isOk = canSubmit();
    const disable = !isOk || state.submitting;
    const enableFakeMint = appService.appConf.enableFakeMint;
    const find = state.sources.filter(e=>utilService.compareAddress(contractAddress, e.address));
    const dropdownText = find.length? find[0].name : "Custom";
    if (loading) {
        return <Container fluid className="d-flex align-items-center justify-content-center col-12 m-0">
            <Card className="col-12 col-md-10 card col-lg-8 col-xl-6">
                <Card.Body className="d-flex justify-content-center">
                    <Spinner animation="grow" variant="primary" />
                </Card.Body>
            </Card>
        </Container>
    }
    return <><Card>
        <Card.Body>
            <Form noValidate validated={true}>
                <Container className="px-md-5 py-md-3">
                    <Container as="h5" className="text-center pb-md-2">IMPORT A LAND</Container>
                    <Container className="text-center pb-md-2 text-muted">Import your land and split it into parts!</Container>
                    {enableFakeMint && <Container as="a" className="d-flex justify-content-center mb-4 pointer text-secondary" onClick={onFakeMint}>I don't have a land but i want to test the service</Container>}
                    <InputGroup size="lg" className="fs-6 mb-4">
                        <InputGroup.Text className="fs-6 p-0">Smart Contract</InputGroup.Text>
                        <FormControl required={true} placeholder={utilService.ZERO_ADDRESS} className="fs-6 min-w200px" value={contractAddress} onChange={(e) => onChangeAddress(e.target.value)} />
                        <DropdownButton className="fs-6" variant="light" align="end" title={dropdownText}>
                            {sources.map((e,index) => {
                                return <Dropdown.Item key={index} className="fs-6" href="#" onClick={(ee) => onChangeSmartContract(e)}>{e.name}</Dropdown.Item>
                            })}
                        </DropdownButton>
                    </InputGroup>
                    <InputGroup size="lg" className="mb-4">
                        <InputGroup.Text className="fs-6 p-0">Token ID</InputGroup.Text>
                        <FormControl required={true} placeholder="Example: 1" minLength={1} className="text-end fs-6" value={tokenId} onChange={(e) => onChangeID(e.target.value)} />
                    </InputGroup>
                    <InputGroup size="lg" className="mb-4">
                        <InputGroup.Text className="fs-6 p-0">Number of parts</InputGroup.Text>
                        <FormControl required={true} placeholder="Example: 1000" minLength={1} className="text-end fs-6" value={supply} onChange={(e) => onChangeSupply(e.target.value)} />
                    </InputGroup>
                    {onFormCancel && <Container className="d-flex align-items-center justify-content-between p-0 pb-3 pt-3">
                        <Button onClick={onFormCancel} href="#" as="a" variant="light" size="lg" className="me-md-1 mb-2 mt-1 flex-grow-1">CANCEL</Button>
                        <Button className="d-flex flex-row justify-content-center flex-grow-1" variant="primary" size="lg" disabled={disable} onClick={onSubmit}>
                            <span>
                                {submitting && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" className="me-1" />}
                                <span>IMPORT</span>
                            </span>
                        </Button>
                    </Container>}
                    {!onFormCancel && <Container className="d-flex align-items-center justify-content-between p-0 pb-3 pt-3">
                        <Container className="d-flex flex-column flex-md-row justify-content-center p-0">
                            <Button className="d-flex flex-row justify-content-center flex-grow-1" variant="primary" size="lg" disabled={disable} onClick={onSubmit}>
                                <span>
                                    {submitting && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" className="me-1" />}
                                    <span>IMPORT</span>
                                </span>
                            </Button>
                        </Container>
                    </Container>}
                </Container>
            </Form>
        </Card.Body>
    </Card>
        <ToastContainer position="middle-center" className="position-fixed" >
            <Toast onClose={() => showAlert({ show: false })} show={alert.show} delay={ALERT_TIMEOUT} autohide bg={alert.type && alert.type.toLowerCase()}>
                <Toast.Body>{alert.message}</Toast.Body>
            </Toast>
        </ToastContainer>
    </>;
};

export default ImportForm;
