import React from 'react';
import { Container, Form, InputGroup, FormControl, Spinner, Button, Toast, ToastContainer } from 'react-bootstrap';
import ModalToken, { TokenAsset } from './modalToken';
import { appService, formatNumber } from './services';
import { ALERT_TIMEOUT, useAlert, useSafeState, useAuthenticatedEffect } from './hooks';
import { LandModel, LockedAmount } from '../../contract/dist/src/services/splitService';
import { Token } from '../../contract/dist/src/services/tokenService';
import { BigNumber } from 'ethers';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export const COIN_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

type OfferFormState = {
    loading: boolean,
    submitting?: boolean
    fillOrKill: boolean
    amount: string
    cost: string
    type: "sell" | "buy"
    currency: string
    currencies: Token[]
    showModalToken?: boolean
}
type OfferFormProps = {
    type: "sell" | "buy"
    land: LandModel<string>,
    currentUser: string
    balance: BigNumber
    locked: LockedAmount
    onFormSave?(Import: OfferFormState): void
}
const OfferForm = ({ onFormSave, land, type, balance, locked }: OfferFormProps) => {
    const { utilService } = appService;
    const [alert, _, showAlert] = useAlert();
    const [state, setState] = useSafeState<OfferFormState>({ currencies: [], loading: true, cost: "", amount: "", fillOrKill: false, currency: COIN_ADDRESS, type });
    const reload = async () => {
        const tmp = await appService.tokenService.getListTokens();
        const currencies = tmp.tokens;
        setState((state) => ({ ...state, loading: false, currencies }))
    }
    useAuthenticatedEffect(() => {
        reload();
    }, [])
    const onChangeCurrencyChange = (currency: TokenAsset) => {
        if (currency) {
            setState((state) => ({ ...state, showModalToken: false, currency: currency.address }))
        }
    }
    const onChangeAmountWish = (amount: string) => {
        let res = formatNumber(amount);
        if (res === false) {
            return;
        }
        setState((state) => ({ ...state, amount }))
    }
    const onChangeDepositTotal = (cost: string) => {
        let res = formatNumber(cost);
        if (res === false) {
            return;
        }
        setState((state) => ({ ...state, cost }))
    }
    const getMax = () => {
        const supply = utilService.toPrecision(land._supply);
        if (type == "buy") {
            const balanceWithLock = getBalanceWithoutLock(true)
            return utilService.fromPrecision(supply.sub(balanceWithLock));
        } else {
            //sell only balance in my possession
            return getBalance(false);
        }
    }
    const getBalance = (precision:boolean) => {
        return utilService.fromPrecision(balance);
    }
    const getBalanceWithoutLock = (precision:boolean) => {
        const tmp = balance.add(locked.amount.sub(locked.amountExecuted));
        return precision? tmp: utilService.fromPrecision(tmp);
    }
    const canSubmit = (stateParam?: OfferFormState) => {
        const { amount, currency, cost, type } = stateParam || state;
        if (!type) {
            return false;
        }
        if (type == "buy") {
            //should not have all supply
            if(+amount > getMax()){
                return false;
            }
        } else if (type == "sell") {
            //should sell more than balance
            if(+amount > getBalance(false)){
                return false;
            }
        }
        return (+amount) > 0 && (+cost) > 0 && !!currency;
    }
    const onSubmit = async () => {
        if (!canSubmit()) {
            return;
        }
        try {
            const { amount, cost, fillOrKill, type, currency } = state;
            setState((state) => ({ ...state, submitting: true }))
            if (type == "buy") {
                if (utilService.compareAddress(currency, utilService.ZERO_ADDRESS) || utilService.compareAddress(currency, COIN_ADDRESS)) {
                    await appService.metaService.createBuyOfferCoin({
                        amount, cost, fillOrKill
                    }, land._address);
                } else {
                    await appService.metaService.createBuyOfferToken({
                        amount, cost, fillOrKill, currency
                    }, land._address);
                }
            } else {
                if (utilService.compareAddress(currency, utilService.ZERO_ADDRESS) || utilService.compareAddress(currency, COIN_ADDRESS)) {
                    await appService.metaService.createSellOfferCoin({
                        amount, fillOrKill, cost
                    }, land._address);
                } else {
                    await appService.metaService.createSellOfferToken({
                        amount, currency, fillOrKill, cost
                    }, land._address);
                }
            }
            showAlert({ type: "success", message: "Order submitted!", show: true })
            onFormSave && onFormSave(state);
        } catch (e) {
            let message = utilService.formatError(e);
            showAlert({ type: "danger", message, show: true })
        } finally {
            setState((state) => ({ ...state, submitting: false }))
        }
    }
    const onShowModal = () => {
        setState((state) => ({ ...state, showModalToken: true }))
    }
    const { amount, currency, fillOrKill, loading, cost, submitting } = state;
    const isOk = canSubmit();
    const disable = !isOk || state.submitting;
    const find = state.currencies.filter(e => utilService.compareAddress(currency, e.address));
    const currencyText = find.length ? find[0].name : "Select";
    const isBuying = type == "buy";
    if (loading) {
        return <Container fluid className="d-flex align-items-center justify-content-center col-12 m-0">
            <Spinner animation="grow" variant="primary" />
        </Container>
    }
    const submitText = isBuying ? "BUY" : "SELL";
    const submitVariant = isBuying ? "success" : "danger";
    return <><Form noValidate validated={true}>
        <Container className="py-md-3 mx-0 px-0">
            {/*<Container as="h5" className="text-center pb-md-2">{submitText} ORDER</Container>*/}
            <InputGroup size="lg" className="mb-4">
                <InputGroup.Text className="fs-6 p-0">Number of parts</InputGroup.Text>
                <FormControl required={true} placeholder={`Max: ${getMax()}`} minLength={1} className="text-end fs-6" value={amount} onChange={(e) => onChangeAmountWish(e.target.value)} />
            </InputGroup>
            <InputGroup size="lg" className="mb-4">
                <InputGroup.Text className="fs-6 p-0">Cost</InputGroup.Text>
                <FormControl required={true} placeholder="Example: 1000" minLength={1} className="text-end fs-6" value={cost} onChange={(e) => onChangeDepositTotal(e.target.value)} />
                <Button className="fs-6" variant="light" onClick={onShowModal}>{currencyText} <FontAwesomeIcon icon={faCaretDown} /></Button>
            </InputGroup>
            <Container className="d-flex align-items-center justify-content-between p-0 pb-3 pt-3">
                <Container className="d-flex flex-column flex-md-row justify-content-center p-0">
                    <Button className="d-flex flex-row justify-content-center flex-grow-1" variant={submitVariant} size="lg" disabled={disable} onClick={onSubmit}>
                        <span>
                            {submitting && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" className="me-1" />}
                            <span>{submitText}</span>
                        </span>
                    </Button>
                </Container>
            </Container>
        </Container>
    </Form>
        <ModalToken onSelect={onChangeCurrencyChange} addMyToken={true} show={state.showModalToken!} hideSearch={false} />
        <ToastContainer position="middle-center" className="position-fixed" >
            <Toast onClose={() => showAlert({ show: false })} show={alert.show} delay={ALERT_TIMEOUT} autohide bg={alert.type && alert.type.toLowerCase()}>
                <Toast.Body>{alert.message}</Toast.Body>
            </Toast>
        </ToastContainer>
    </>;
};

export default OfferForm;
