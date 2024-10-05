import React from 'react';
import { Container, Spinner, Card, Nav,Button } from 'react-bootstrap';
import { appService,LockedAmount } from '../components/services';
import { useSafeState, useAuthenticatedEffect } from '../components/hooks';
import { LandModel } from '../../contract/dist/src/services/splitService';
import { BigNumber } from '@ethersproject/bignumber';
import OfferDetail from './offerDetail';
import OfferList from './offersList';
import OfferForm from './offerForm';
import TradeList from "./tradeList"
type Screen = "view" | "form" | "orders" | "trades" | "myorders";
type CardViewState = {
    loading: boolean
    model: LandModel<string>
    balance?: BigNumber
    currentUser?: string
    screen: Screen
    locked?:LockedAmount
    version?:Date
}
type CardViewProps = { 
    model: LandModel<string>, 
    onReload: () => void, 
    onCancel: () => void, 
    onDelete: () => void, 
    version?: Date 
}
const CardView = (props: CardViewProps) => {
    const utilService = appService.utilService;
    const [state, setState] = useSafeState<CardViewState>({ loading: true, model: props.model, screen: "view" });
    const reload = async (trigger: boolean) => {
        const balancePromise = appService.metaService.getBalanceOfManager(props.model._address);
        const list = await appService.metaService.getManagers();
        const user = await appService.web3Service.getSigner();
        const currentUser = await user.getAddress();
        const lockPromise = appService.metaService.getLockedAmount(props.model._address,currentUser);
        const balance = await balancePromise
        const locked = await lockPromise;
        setState((state) => ({ ...state,version:new Date, loading: false, list, balance, currentUser,locked }))
        trigger && props.onReload();
    }
    useAuthenticatedEffect(() => {
        reload(false);
    }, [])
    /*const percent = () => {
        return utilService.fromPrecision(state.balance.div(props.model?._supply!).mul(100))
    }
    */
    const land = state.model;
    /*
    const onCancelForm = (trigger: boolean) => {
        setState((state) => ({ ...state, screen: "view" }))
        trigger && reload(true);
    }
    */
   const onReload = async () => {
       await reload(true);
       props.onReload();
   }
    const onSelectNav = (screen:Screen) => {
        setState((state)=>({...state, screen}))
    }
    const loadingView = () => {
        return <Container fluid className="d-flex align-items-center justify-content-center col-12 m-0">
            <Card className="col-12 col-md-10 card col-lg-8 col-xl-6">
                <Card.Body className="d-flex justify-content-center">
                    <Spinner animation="grow" variant="primary" />
                </Card.Body>
            </Card>
        </Container>
    }
    const getLockedAmount = () => {
        const tmp = state.locked.amount.sub(state.locked.amountExecuted)
        return utilService.fromPrecision(tmp);
    }
    if (state.loading) {
        return loadingView();
    }
    return <><Card className="container col">
        <Card.Body>
            <Card.Title className="container d-flex justify-content-between align-items-center">
                <h4 className="text-dark">{land._meta?.name}</h4>
                <Button variant="outline" className="text-dark" onClick={props.onCancel}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </Button>
            </Card.Title>
            <Nav activeKey={state.screen} className="nav-underline container my-5 mx-3" fill={true} onSelect={(selectedKey) => onSelectNav(selectedKey as any)}>
                <Nav.Item>
                    <Nav.Link eventKey="view">Details</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="orders">Orders</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="myorders">My Orders</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="trades">My Trades</Nav.Link>
                </Nav.Item>
            </Nav>
            {state.screen=="view" && <OfferDetail locked={getLockedAmount().toString()} currentUser={state.currentUser!} balance={state.balance!} land={state.model} onWithdraw={props.onDelete}/>}
            {state.screen=="orders" && <Container className="d-flex">
                <Container className="col-12 col-sm-8 col-md-9">
                <OfferList version={state.version} filter="active" currentUser={state.currentUser!} balance={state.balance!} model={state.model} onReload={onReload} />
                </Container>
                <Container className="d-flex flex-column col-12 col-sm-4 col-md-3">
                    <Container className="text-dark m-0 mb-2 d-flex flex-column bg-light py-3 container rounded">
                        <Container className="d-flex m-0 p-0 justify-content-between align-items-center">
                            <Container className="m-0 p-0">Balance</Container>
                            <Container className="m-0 p-0 text-end" as="small">{utilService.fromPrecision(state.balance!)} PARTS</Container> 
                        </Container>
                        <Container className="d-flex m-0 p-0 justify-content-between align-items-center">
                            <Container className="m-0 p-0">Locked</Container>
                            <Container className="m-0 p-0 text-end" as="small">{getLockedAmount()} PARTS</Container>
                        </Container>
                    </Container>
                    <OfferForm currentUser={state.currentUser!} locked={state.locked!} balance={state.balance!} land={state.model} type='buy' onFormSave={onReload}/>
                    <OfferForm currentUser={state.currentUser!} locked={state.locked!} balance={state.balance!} land={state.model} type='sell' onFormSave={onReload}/>
                </Container>
            </Container>}
            {state.screen=="myorders" && <OfferList filter="mine" currentUser={state.currentUser!} balance={state.balance!} model={state.model}  onReload={onReload}/>}
            {state.screen=="trades" && <TradeList currentUser={state.currentUser!} balance={state.balance!} model={state.model}  onReload={onReload}/>}
        </Card.Body>
    </Card>
    </>;
};

export default CardView;
