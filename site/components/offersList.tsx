import React from 'react';
import { Toast, Spinner, ToastContainer, Button, Container, Modal, Table } from 'react-bootstrap';
import { appService } from './services';
import { ALERT_TIMEOUT, useAlert, useSafeState, useAuthenticatedEffect } from './hooks';
import { LandModel } from 'contract/dist/src/services/splitService';
import { BigNumber } from '@ethersproject/bignumber';
import { TokenAsset } from './modalToken';

type Filter = "active" | "mine" | "inactive"

type OfferListState = {
    loading: boolean
    model: LandModel<string>
    sells: Array<Order>
    buys: Array<Order>
    tokens: Array<TokenAsset>
    submitting?: boolean
    current?: Order
    modal?: "buyoffer" | "selloffer" | "del-buyoffer" | "del-selloffer",
}

type OfferListProps = {
    balance?: BigNumber
    currentUser?: string
    model: LandModel<string>,
    filter: Filter,
    version?: Date
    onReload: () => void
}
const OfferList = (props: OfferListProps) => {
    const [state, setState] = useSafeState<OfferListState>({ loading: true, model: props.model, buys: [], sells: [], tokens: [] });
    const { utilService } = appService;
    const [alert, _, showAlert] = useAlert();
    const filterOrders = (filterOverride?: Filter) => {
        return (sell: Order) => {
            const filter = filterOverride || props.filter;
            if (filter == "active") {
                return sell.amount.gt(sell.amountExecuted);
            } else if (filter == "inactive") {
                return sell.amount.eq(sell.amountExecuted);
            } else {
                //mine
                return sell.owner == props.currentUser;
            }
        }
    }
    const reload = async (trigger: boolean, filterOverride?: Filter) => {
        const tmp = await appService.tokenService.getListTokens();
        let buysPromise = appService.metaService.getBuyOffers(props.model._address);
        let sells = await appService.metaService.getSellOffers(props.model._address);
        let buys = await buysPromise;
        sells = sells.filter(filterOrders(filterOverride))
        buys = buys.filter(filterOrders(filterOverride))
        setState((state) => ({ ...state, loading: false, buys, sells, tokens: tmp.tokens }))
        trigger && props.onReload()
    }
    useAuthenticatedEffect(() => {
        reload(false);
    }, [props.version, props.balance, props.filter, props.currentUser])
    const getCurrency = (currency: string) => {
        const found = state.tokens.filter(e => {
            return utilService.compareAddress(e.address, currency)
        })
        if (found.length) {
            return found[0].symbol
        }
        if (utilService.compareAddress(currency, utilService.ZERO_ADDRESS)) {
            return "ETH"
        }
        return "";
    }
    const hideModal = () => {
        setState((state) => ({ ...state, modal: undefined, current: undefined }))
    }
    const showAcceptOffer = (current: Order) => {
        setState((state) => ({ ...state, modal: current.buy?"buyoffer":"selloffer", current }))
    }
    const acceptBuyOffer = async (buy: Order) => {
        try {
            const { model } = state;
            setState((state) => ({ ...state, submitting: true }))
            await appService.metaService.acceptBuyOrder(buy.id, model._address);
            showAlert({ type: "success", message: "Transaction submitted", show: true });
            await reload(true);
        } catch (e) {
            let message = utilService.formatError(e);
            showAlert({ type: "danger", message, show: true })
        } finally {
            hideModal()
            setState((state) => ({ ...state, submitting: false }))
        }
    }
    const acceptSellOffer = async (sell: Order) => {
        try {
            const { model } = state;
            setState((state) => ({ ...state, submitting: true }))
            const topay = utilService.fromPrecision(sell.cost.sub(sell.costExecuted));
            await appService.metaService.acceptSellOrder(sell.id, topay, model._address);
            showAlert({ type: "success", message: "Transaction submitted", show: true });
            await reload(true);
        } catch (e) {
            let message = utilService.formatError(e);
            showAlert({ type: "danger", message, show: true })
        } finally {
            hideModal()
            setState((state) => ({ ...state, submitting: false }))
        }
    }
    const showDeleteOffer = (current: Order) => {
        setState((state) => ({ ...state, modal: current.buy?"del-buyoffer":"del-selloffer", current }))
    }
    const deleteBuyOffer = async (buy: Order) => {
        try {
            const { model } = state;
            setState((state) => ({ ...state, submitting: true }))
            await appService.metaService.deleteBuyOrder(buy.id, model._address);
            showAlert({ type: "warning", message: "Buy order deleted", show: true });
            await reload(true);
        } catch (e) {
            let message = utilService.formatError(e);
            showAlert({ type: "danger", message, show: true })
        } finally {
            hideModal()
            setState((state) => ({ ...state, submitting: false }))
        }
    }
    const deleteSellOffer = async (sell: Order) => {
        try {
            const { model } = state;
            setState((state) => ({ ...state, submitting: true }))
            await appService.metaService.deleteSellOrder(sell.id, model._address);
            showAlert({ type: "warning", message: "Sell order deleted", show: true });
            await reload(true);
        } catch (e) {
            let message = utilService.formatError(e);
            showAlert({ type: "danger", message, show: true })
        } finally {
            hideModal()
            setState((state) => ({ ...state, submitting: false }))
        }
    }
    const getRemainAmount = (buy: Order) => {
        if (!buy || !buy.amount) {
            return '';
        }
        return `${utilService.fromPrecision(buy.amount.sub(buy.amountExecuted))}`
    }
    const getRemainCost = (buy: Order) => {
        if (!buy || !buy.cost) {
            return '';
        }
        return `${utilService.fromPrecision(buy.cost.sub(buy.costExecuted))}`
    }
    const getBuyLabel = (buy: Order, reverse : boolean) => {
        if(reverse){
            return buy.buy?"SELL":"BUY"
        }
        return buy.buy?"BUY":"SELL"
    }
    const getBuyLabelCss = (buy: Order) => {
        return buy.buy?"btn btn-danger":"btn btn-success"
    }
    const cantExecute = (buy: Order) => {
        return utilService.compareAddress(buy.owner, props.currentUser);
    }
    const { buys, sells, current } = state;
    const all = [...buys, ...sells];
    if (state.loading) {
        return <Container className="d-flex align-items-center justify-content-center">
            <Spinner animation="grow" variant="primary" />
        </Container>
    }
    return <><Container className="d-flex flex-column flex-md-row align-items-start justify-content-between flex-lg-row align-items-lg-start">
        <Container className="col-12">
            <Table className="table-de">
                <thead>
                    <tr>
                        <th className="text-small">Side</th>
                        <th className="text-small">Amount</th>
                        <th className="text-small">Cost</th>
                        <th className="text-small">From</th>
                        <th className="text-small"></th>
                    </tr>
                </thead>
                <tbody>
                    {all.map((buy, index) => <tr className="pointer" key={index}>
                        <td className="text-small align-middle">{getBuyLabel(buy, false)}</td>
                        <td className="align-middle">{getRemainAmount(buy)} PARTS</td>
                        <td className="align-middle">{getRemainCost(buy)} {getCurrency(buy.currency)}</td>
                        <td className="text-truncate">{((buy.owner))}</td>
                        {props.filter == "active" && <td className="align-middle py-2 text-end"><Button size="sm" onClick={() => showAcceptOffer(buy)} disabled={cantExecute(buy)} className={getBuyLabelCss(buy)}>{getBuyLabel(buy, true)}</Button></td>}
                        {props.filter == "inactive" && <td></td>}
                        {props.filter == "mine" && <td className="align-middle py-0 text-end"><Button onClick={() => showDeleteOffer(buy)} variant="outline" className="text-warning">Cancel</Button></td>}
                    </tr>)}
                    {all.length == 0 && <tr className="pointer">
                    <td colSpan={5} className="p-5 text-center">No orders</td>
                    </tr>}
                </tbody>
            </Table>
        </Container>
    </Container>
        <ToastContainer position="middle-center" className="position-fixed" >
            <Toast onClose={() => showAlert({ show: false })} show={alert.show} delay={ALERT_TIMEOUT} autohide bg={alert.type && alert.type.toLowerCase()}>
                <Toast.Body>{alert.message}</Toast.Body>
            </Toast>
        </ToastContainer>
        {current && <Modal onHide={hideModal} centered show={state.modal == "buyoffer"}>
            <Modal.Body className="text-primary d-flex flex-column text-center py-4 px-5">
                <p className="mb-3 text-dark">SUBMIT ORDER</p>
                <p className="mb-4 text-muted">You are going to sell {getRemainAmount(current!)} PARTS / {getRemainCost(current!)} {getCurrency(current?.currency)}</p>
                <small className="text-muted">Buyer: {current.owner}</small>
                <Container className="d-flex align-items-center justify-content-between p-0 pb-3 pt-3">
                    <Button onClick={hideModal} href="#" as="a" variant="light" size="lg" className="me-md-1 mb-2 mt-1 flex-grow-1">CANCEL</Button>
                    <Button className="d-flex flex-row justify-content-center flex-grow-1" variant="danger" size="lg" onClick={() => acceptBuyOffer(current)} disabled={state.submitting}>
                        <span>
                            {state.submitting && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" className="me-1" />}
                            <span>SELL</span>
                        </span>
                    </Button>
                </Container>
            </Modal.Body>
        </Modal>}
        {current && <Modal onHide={hideModal} centered show={state.modal == "selloffer"}>
            <Modal.Body className="text-primary d-flex flex-column text-center py-4 px-5">
                <p className="mb-3 text-dark">SUBMIT ORDER</p>
                <p className="mb-4 text-muted">You are going to buy {getRemainAmount(current!)} PARTS / {getRemainCost(current!)} {getCurrency(current?.currency)}</p>
                <small className="text-muted">Seller: {current.owner}</small>
                <Container className="d-flex align-items-center justify-content-between p-0 pb-3 pt-3">
                    <Button onClick={hideModal} href="#" as="a" variant="light" size="lg" className="me-md-1 mb-2 mt-1 flex-grow-1">CANCEL</Button>
                    <Button className="d-flex flex-row justify-content-center flex-grow-1" variant="success" size="lg" onClick={() => acceptSellOffer(current)} disabled={state.submitting}>
                        <span>
                            {state.submitting && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" className="me-1" />}
                            <span>BUY</span>
                        </span>
                    </Button>
                </Container>
            </Modal.Body>
        </Modal>}
        {current && <Modal onHide={hideModal} centered show={state.modal == "del-buyoffer"}>
            <Modal.Body className="text-primary d-flex flex-column text-center py-4 px-5">
                <p className="mb-3 text-dark">CANCEL BUY ORDER</p>
                <p className="mb-4 text-muted">You are going to cancel your order : {getRemainAmount(current!)} PARTS / {getRemainCost(current!)} {getCurrency(current?.currency)}</p>
                <b className="text-muted">Do you confirm?</b>
                <Container className="d-flex align-items-center justify-content-between p-0 pb-3 pt-3">
                    <Button onClick={hideModal} href="#" as="a" variant="light" size="lg" className="me-md-1 mb-2 mt-1 flex-grow-1">ABORT</Button>
                    <Button className="d-flex flex-row justify-content-center flex-grow-1" variant="warning" size="lg" onClick={() => deleteBuyOffer(current)} disabled={state.submitting}>
                        <span>
                            {state.submitting && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" className="me-1" />}
                            <span>CONFIRM</span>
                        </span>
                    </Button>
                </Container>
            </Modal.Body>
        </Modal>}
        {current && <Modal onHide={hideModal} centered show={state.modal == "del-selloffer"}>
            <Modal.Body className="text-primary d-flex flex-column text-center py-4 px-5">
                <p className="mb-3 text-dark">CANCEL SELL ORDER</p>
                <p className="mb-4 text-muted">You are going to cancel your order : {getRemainAmount(current!)} PARTS / {getRemainCost(current!)} {getCurrency(current?.currency)}</p>
                <b className="text-muted">Do you confirm?</b>
                <Container className="d-flex align-items-center justify-content-between p-0 pb-3 pt-3">
                    <Button onClick={hideModal} href="#" as="a" variant="light" size="lg" className="me-md-1 mb-2 mt-1 flex-grow-1">ABORT</Button>
                    <Button className="d-flex flex-row justify-content-center flex-grow-1" variant="warning" size="lg" onClick={() => deleteSellOffer(current)} disabled={state.submitting}>
                        <span>
                            {state.submitting && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" className="me-1" />}
                            <span>CONFIRM</span>
                        </span>
                    </Button>
                </Container>
            </Modal.Body>
        </Modal>}
    </>;
};
type Order = {
    id: BigNumber;
    amount: BigNumber;
    amountExecuted: BigNumber;
    currency: string;
    cost: BigNumber;
    costExecuted: BigNumber;
    fillOrKill: boolean;
    at: BigNumber;
    owner: string;
    buy:boolean
}
export default OfferList;
