import React from 'react';
import { Container } from 'react-bootstrap';
import NavbarComponent from "./navbar";
import NetworkModal from "./networkModal";
import { appService } from './services';
import LoginModal from './loginModal';
import { useSafeState } from './hooks';
import debounce from "debounce";

type LoginState = {loading: boolean, date: Date, showNetwork:boolean}
const LoginGuard = ({children,...props}:{children:React.ReactElement | React.ReactElement[], onReload:()=>void}) => { 
  const web3Service = appService.web3Service;
  const onReload = debounce(props.onReload, 200)
  const [state, setState] = useSafeState<LoginState>({ loading: true, date: new Date,showNetwork:false });
  React.useEffect(()=>{
    const exec = async ()=>{
      try{
        await appService.web3Service.tryConnect(false)
      }finally{
        setState(state=>({...state, loading: false}))      
      }
    }
    exec();
  },[])
  React.useEffect(() => {
    const unregister1 = appService.web3Service.onAccountChanged(async () => {
      console.log("event account changed")
      await appService.web3Service.tryConnect(true)
      setState(state => ({ ...state, date: new Date() }))
      onReload();
    })
    const unregister2 = appService.web3Service.onAuthenticated(() => {
      console.log("event authenticate")
      setState(state => ({ ...state, date: new Date() }))
      onReload();
    })
    const unregister2b = appService.web3Service.onConnect(() => {
      console.log("event connect")
      setState(state => ({ ...state, date: new Date() }))
      onReload();
    })
    const unregister2c = appService.web3Service.onDisconnect(() => {
      console.log("event disconnect")
      setState(state => ({ ...state, date: new Date() }))
      onReload();
    })
    const checkNetwork = async () => {
      console.log("event check network")
      const networkIsOk = await appService.web3Service.checkCurrentNetwork();
      if (networkIsOk) {
        setState(state => ({ ...state, date: new Date(), showNetwork: false }))
        onReload();
        await appService.web3Service.tryConnect(true)
        setState(state => ({ ...state, date: new Date() }))
        onReload();
      } else {
        setState(state => ({ ...state, date: new Date(), showNetwork: true }))
      }
      onReload();
    }
    const unregister3 = appService.web3Service.onNetworkChanged(checkNetwork)
    checkNetwork();
    return () => {
      unregister1();
      unregister2();
      unregister2b();
      unregister2c();
      unregister3();
    }
  },[])
  const onLogin = () =>{
    setState(state=>({...state, date: new Date})) 
  }
  const onHideNetwork = () =>{
    setState(state=>({...state, showNetwork: false})) 
  }
  if(!web3Service.isAuthenticated){
    return <LoginModal loading={state.loading} onSuccess={onLogin}/>
  }
  return <>
    <NavbarComponent onReload={onReload}/>
    <Container className="app-screen" key={state.date.getTime()}>
      {children}
    </Container>
    <NetworkModal showNetwork={state.showNetwork} onHide={onHideNetwork}/>
  </>;
};

export default LoginGuard;
