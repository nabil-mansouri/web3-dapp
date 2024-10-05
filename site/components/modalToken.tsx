import React, { ChangeEvent } from 'react';
import {Modal, Spinner,Form,FormControl,Image,ListGroup} from 'react-bootstrap';
import { useAuthenticatedEffect, useSafeState } from './hooks';
import { appService ,ASSETS} from './services';

const MY_TOKEN={
    "symbol": "TOK",
    "name": "Split",
    "address": appService.appConf.contracts.splitToken,
    "decimals": 18,
    "logoURI": ASSETS.logo
}
export type TokenAsset = {
    "symbol": string,
    "name": string,
    "address": string,
    "decimals": number,
    "logoURI": string
}
type ModalTokenState = {
    original?: TokenAsset[],
    filtered?: TokenAsset[]
    loading: boolean
}
const ModalToken = (args: { show: boolean,title?:string, addMyToken?:boolean, hideSearch?:boolean, onSelect(asset?: TokenAsset): void, filter?(asset?: TokenAsset):boolean }) => {
    const [state, setState] = useSafeState<ModalTokenState>({ loading: true });
    useAuthenticatedEffect(() => {
        const exec = async () => {
            const original = await appService.tokenService.getListTokens();
            const tmp = {...original};
            if(args.addMyToken){
                if(tmp.tokens.filter(e=>e.symbol==MY_TOKEN.symbol).length==0){
                    tmp.tokens.push({...MY_TOKEN, logoURI: MY_TOKEN.logoURI})
                }
            }
            const assets: TokenAsset[] = tmp.tokens.map(e=> {
                return e;
            }).filter(e=>{
                if(args.filter){
                    return args.filter(e)
                }
                return true;
            });
            setState({ original: assets, filtered: assets, loading: false });
        }
        exec();
    }, [])
    const search = (e: ChangeEvent) => {
        let searchVal = ((e.target as any).value as string).toLowerCase();
        const filtered = state.original?.filter(e => e.name?.toLowerCase().indexOf(searchVal) > -1 || e.symbol?.toLowerCase().indexOf(searchVal) > -1)
        setState({ ...state, filtered });
    }
    const title = args.title || "Select a token";
    return <Modal centered show={args.show} contentClassName="p-0 rounded-15" dialogClassName="max-400" onHide={()=>args.onSelect(undefined)}>
        <Modal.Header className="d-flex flex-column align-items-stretch">
            <ListGroup as="ol" className="list-group-flush pointer px-0">
                <ListGroup.Item as="li" className="d-flex flex-column justify-content-between p-2">
                    <Form.Label>{title}</Form.Label>
                    {!args.hideSearch && <FormControl placeholder="Search" onChange={search} />}
                </ListGroup.Item>
            </ListGroup>
            </Modal.Header>
        <Modal.Body className="p-0 max-h50 overflow-scroll">
            <ListGroup as="ol" className="list-group-flush pointer px-0" style={{maxHeight:"70vh"}}>
             {state.filtered?.map((a,index) => {
                    return <ListGroup.Item key={index} action as="li" className="d-flex align-items-center justify-content-between p-3" onClick={(_e)=> args.onSelect(a)}>
                        <Image src={a.logoURI} className="me-3" width={40} height={40} />
                        <p className="text-muted flex-grow-1 m-0"> <b className="text-dark">{a.symbol}</b><br /><small>{a.name}</small></p>
                    </ListGroup.Item>;
                })}
            {state.loading && <ListGroup.Item action as="li" className="d-flex align-items-center justify-content-between p-3" >
                <Spinner as="span" animation="grow" role="status" aria-hidden="true" className="me-1" />    
            </ListGroup.Item>}
            </ListGroup>
        </Modal.Body>
        <Modal.Footer className="border-0"></Modal.Footer>
    </Modal>
}

export default ModalToken;