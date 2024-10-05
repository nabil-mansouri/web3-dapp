import React from 'react';
import { Toast, Spinner, ToastContainer, Button, Container, Modal, Table } from 'react-bootstrap';
import { appService } from './services';
import { ALERT_TIMEOUT, useAlert, useSafeState, useAuthenticatedEffect } from './hooks';
import { LandModel } from 'contract/dist/src/services/splitService';
import { BigNumber } from '@ethersproject/bignumber';
import { TokenAsset } from './modalToken';
function ISODateString(d:Date) {
    function pad(n) {return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
         + pad(d.getUTCMonth()+1)+'-'
         + pad(d.getUTCDate())+' '
         + pad(d.getUTCHours())+':'
         + pad(d.getUTCMinutes())+':'
         + pad(d.getUTCSeconds())+''
}

type OfferListState = {
    loading: boolean
    model: LandModel<string>
    trades: Array<Trade>
    tokens: Array<TokenAsset>
    submitting?: boolean
}
type Trade = {
    id: BigNumber;
    orderId: BigNumber;
    amount: BigNumber;
    cost: BigNumber;
    currency: string;
    at: BigNumber;
    buyer: string;
    seller: string;
}
type OfferListProps = {
    balance?: BigNumber
    currentUser?: string
    model: LandModel<string>,
    version?: Date
    onReload: () => void
}
const TradeList = (props: OfferListProps) => {
    const [state, setState] = useSafeState<OfferListState>({ loading: true, model: props.model, trades: [], tokens: [] });
    const { utilService } = appService;
    const reload = async (trigger: boolean) => {
        const tmp = await appService.tokenService.getListTokens();
        let trades =await  appService.metaService.getTradesByAddress(props.model._address, props.currentUser);
        trades = trades.map(e=>{
            return {...e, at: e[5]}
        })
        setState((state) => ({ ...state, loading: false, trades, tokens: tmp.tokens }))
        trigger && props.onReload()
    }
    useAuthenticatedEffect(() => {
        reload(false);
    }, [props.version, props.balance, props.currentUser])
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
    const getRemainAmount = (buy: Trade) => {
        if (!buy || !buy.amount) {
            return '';
        }
        return `${utilService.fromPrecision(buy.amount)}`
    }
    const getRemainCost = (buy: Trade) => {
        if (!buy || !buy.cost) {
            return '';
        }
        return `${utilService.fromPrecision(buy.cost)}`
    }
    const getBuyLabel = (buy: Trade, reverse : boolean) => {
        if(reverse){
            return buy.buyer == props.currentUser?"SELL":"BUY"
        }
        return buy.buyer == props.currentUser?"BUY":"SELL"
    }  
    const getOtherSide = (buy: Trade) =>{
        return buy.buyer == props.currentUser?buy.seller: buy.buyer;
    }
    const { trades } = state;
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
                        <th className="text-small">At</th>
                    </tr>
                </thead>
                <tbody>
                    {trades.map((buy, index) => <tr className="pointer" key={index}>
                        <td className="text-small align-middle">{getBuyLabel(buy, false)}</td>
                        <td className="align-middle">{getRemainAmount(buy)} PARTS</td>
                        <td className="align-middle">{getRemainCost(buy)} {getCurrency(buy.currency)}</td>
                        <td className="text-truncate">{getOtherSide(buy)}</td>
                        <td className="text-truncate">{ISODateString(new Date(buy.at.toNumber() * 1000))}</td>
                    </tr>)}
                    {trades.length == 0 && <tr className="pointer">
                    <td colSpan={5} className="p-5 text-center">No trades</td>
                    </tr>}
                </tbody>
            </Table>
        </Container>
    </Container>   
    </>;
};
export default TradeList;
