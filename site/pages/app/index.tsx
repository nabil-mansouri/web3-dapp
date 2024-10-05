import React from 'react';
import { Button, Container, Card, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPlus } from '@fortawesome/free-solid-svg-icons';
import * as fab from 'react-tiny-fab'
import { appService, formatNumber } from '../../components/services';
import { ALERT_TIMEOUT, useAlert, useSafeState, useAuthenticatedEffect } from '../../components/hooks';
import LoginGuard from "../../components/loginGuard";
import CardList from "../../components/cardList";
import CardView from "../../components/cardView";
import ImportForm from "../../components/importForm";
import { LandDetails, LandModel } from '../../../contract/dist/src/services/splitService';

type IndexState = {
  loading: boolean
  date?:Date
  view?:LandModel<string>
  list: LandModel<string>[]
  screen: "list" | "form" | "view";
}
const Index = (props:{mine?:boolean}) => {
  const [state, setState] = useSafeState<IndexState>({ screen: "list", loading: true, list: [] });
  const { utilService } = appService;
  const [alert, _, showAlert] = useAlert();
  const reload = async () => {
    const signer = await appService.web3Service.getSigner();
    const address = await signer.getAddress()
    let list = await appService.metaService.getManagers();
    list = list.filter(e=>{
      return e._id.gt(0);
    })
    if(props.mine){
      list = list.filter(e=>{
        return e._owner == address
      })
    }
    setState((state) => ({ ...state, loading: false, list }))
  }
  useAuthenticatedEffect(() => {
    reload();
  }, [])
  const onStartImportLand = () => {
    setState((state) => ({ ...state, screen: "form" }))
  }
  const onFormClose = async () => {
    setState((state) => ({ ...state, screen: "list", loading: true }))
    await reload();
    setState((state) => ({ ...state, screen: "list", loading: false }))
  }
  const seeView = (view:LandModel<string>) => {
    setState((state)=>({...state, screen:"view", view}))
  }
  const onCancelView = ()=>{
    setState((state)=>({...state, screen:"list", view:undefined}))
  }
  const onDeleteView = async ()=>{
    setState((state) => ({ ...state, screen:"list", loading: true }))
    await reload();
    setState((state)=>({...state, screen:"list", view:undefined}))
  }
  const onReload = () => {
    setState((state)=>({...state, screen:"list", view:undefined,date: new Date}))
  }
  const onReloadForce = async () => {
    setState((state) => ({ ...state, screen:"list", loading: true }))
    await reload();
    setState((state)=>({...state, screen:"list", view:undefined,date: new Date}))
  }
  const onReloadView = () => {
    setState((state)=>({...state, date: new Date}))
  }
  if (state.screen == "view") {
    return <LoginGuard onReload={onReloadForce}>      
        <Container className="d-flex flex-column align-content-center align-items-center justify-content-center">
          <CardView model={state.view!} onCancel={onCancelView} version={state.date} onDelete={onDeleteView} onReload={onReloadView}/>   
      </Container>
    </LoginGuard>;
  }
  if (state.screen == "form") {
    return <LoginGuard onReload={onReloadForce}>
      <Container className="app-screen-size d-flex flex-column align-content-center align-items-center justify-content-center">
        <ImportForm onFormCancel={onFormClose} onFormSave={onFormClose} />
      </Container>
    </LoginGuard>;
  }
  return <LoginGuard onReload={onReloadForce}>
    <>
    <CardList customCard={true} loading={state.loading} list={state.list} empty={() => {
      return <Container className="app-screen-size d-flex align-content-center align-items-center justify-content-center">
        <Container className="d-flex flex-column max-w400px text-center align-items-center">
          <div className="max-w150px m-2 rounded-circle ratio ratio-1x1 d-flex align-items-center justify-content-center bg-dark-02">
            <FontAwesomeIcon style={{ position: "initial" }} className="fa-4x text-light" icon={faDownload} />
          </div>
          <Container as="h1" className="mt-2 text-dark">Empty market</Container>
          <Container as="p" className="mt-2 my-3 fs-5">Import & Partition your land and sell parts in the market!</Container>
          <Button onClick={onStartImportLand} className="d-flex flex-row justify-content-center flex-grow-1 mt-3" variant="primary" size="lg">
            <span>IMPORT MY LAND</span>
          </Button>
        </Container>
      </Container>
    }} child={(land, index) => {
      return <>
        <Card style={{ width: '18rem', cursor:"pointer" }} onClick={()=>seeView(land)}>
          <Card.Img variant="top" src={land._meta?.image} />
          <Card.Body>
            <Card.Title><span className="text-dark">{land._meta?.name}</span></Card.Title>
            <Card.Text className="d-flex flex-wrap">
              <Badge bg="primary" pill={true}>{land._supply.toString()} PARTS</Badge>
              <Badge bg="light" className="text-muted" pill={true}>{land?._erc721 ? "ERC21" : "ERC1155"}</Badge>
              <Badge bg="light" className="text-muted max-w200px text-truncate" pill={true}>{land?._owner} OWNER</Badge>
            </Card.Text>
          </Card.Body>
        </Card>
        {props.mine && <fab.Fab onClick={onStartImportLand} icon={<FontAwesomeIcon icon={faPlus} />}/>}
      </>
    }} />
    </>
  </LoginGuard>;
};

export default Index;
