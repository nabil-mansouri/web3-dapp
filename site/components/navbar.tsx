import React, { MouseEvent, useEffect } from 'react';
import {Container,Navbar, Nav, Image,Badge,Toast} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { appService, ASSETS } from './services';
import { NavDropdown, ToastContainer } from 'react-bootstrap';
import { ALERT_TIMEOUT, useAlert, useSafeState } from './hooks';

type NavbarState = { tokenAmount: string, coinAmount: string };
const NavbarComponent = (props:{onReload:()=>void}) => {
  const web3Service = appService.web3Service;
  const router = useRouter();
  const [state, setState] = useSafeState<NavbarState>({ coinAmount: "", tokenAmount: "" })
  const [alert, _setAlert, showAlert] = useAlert();
  useEffect(() => {
    const exec = async () => {
      const tokenPromise = appService.web3Service.getBalanceSplitNoPrecision();
      const nativPromise = appService.web3Service.getBalanceCoinNoPrecision();
      try {
        const token = await tokenPromise;
        setState((state) => ({ ...state, tokenAmount: token.toFixed(2) || "0" }))
      } catch (e) {
        setState((state) => ({ ...state, tokenAmount: "0" }))
        console.error(e);
      }
      try {
        const nativ = await nativPromise;
        setState((state) => ({ ...state, coinAmount: nativ.toFixed(2) || "0" }))
      } catch (e) {
        setState((state) => ({ ...state, coinAmount: "0" }))
        console.error(e);
      }
    }

    exec();
    const unsub = web3Service.onAccountChanged(exec);
    const unsub1 = web3Service.onBalanceChange((balance) => {
      setState((state) => ({ ...state, coinAmount: balance || "0" }))
    })
    const unsub2 = web3Service.onSplitTokenChange(async (balance) => {
      const token = await appService.web3Service.getBalanceSplitNoPrecision();
      setState((state) => ({ ...state, tokenAmount: token.toFixed(2) || "0" }))
    })
    return () => {
      unsub();
      unsub1.then(e => e());
      unsub2.then(e => e());
    }
  }, [])
  const routeTo = (route: string) => {
    return (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      return router.push(route, undefined, { shallow: true }).then(e=>{
        props.onReload();
      })
    }
  }
  const logout = async () => {
    try {
      await web3Service.logout();
      router.push('/app');
    } catch (e) { }
  }
  const isActive = (path: string) => {
    return router.pathname.startsWith(path);
  }
  const isActiveExact = (path: string) => {
    return router.pathname == (path);
  }
  const myName = "W3";
  const { coinAmount, tokenAmount } = state;
  const children = () => {
    return <><Navbar.Brand href="/app" onClick={routeTo("/app")}>
        <Image src={ASSETS.logo} width={50} />
      </Navbar.Brand>
      <Navbar.Brand href="/app" onClick={routeTo("/app")}>{myName}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto align-items-center justify-content-center">
          <Nav.Link href="/app" active={isActiveExact("/app")} onClick={routeTo("/app")}>Market</Nav.Link>
          <Nav.Link href="/app/mine" active={isActive("/app/mine")} onClick={routeTo("/app/mine")}>My Lands</Nav.Link>
          <Nav.Link href="/app/governance" active={isActive("/app/governance")} onClick={routeTo("/app/governance")}>Governance</Nav.Link>
          <Nav.Link href="https://docs.W3.io/" target="_blank">Doc</Nav.Link>
        </Nav>
      <div className="justify-content-end text-primary d-flex flex-md-row flex-column align-items-center">
        {web3Service.isAuthenticated && <Nav.Link href="#" onClick={()=>{}} className="align-items-center d-none d-lg-flex text-muted">
            <Badge bg="dark" pill={true} className="text-truncate max-w100px">{web3Service.currentUserAddress}</Badge>
        </Nav.Link>}
        {web3Service.isAuthenticated && <Nav.Link href="#" onClick={()=>{}} className="align-items-center justify-content-center d-flex d-sm-none text-muted">
          <Badge bg="dark" pill={true} className="text-truncate max-w100px" style={{ maxWidth: "100%" }}>{web3Service.currentUserAddress}</Badge>
        </Nav.Link>}
        {web3Service.isAuthenticated && <Nav.Link href="/app" className=" d-flex d-sm-none align-items-center justify-content-center text-muted pb-0">{tokenAmount}<Image className="ms-1" src={ASSETS.logo} width={15} /></Nav.Link>}
        {web3Service.isAuthenticated && <Nav.Link href="/app" className=" d-flex d-sm-none align-items-center justify-content-center text-muted pb-0">{coinAmount}<Image className="ms-1" src={ASSETS.native} width={15} /></Nav.Link>}
        {web3Service.isAuthenticated && <>
          <Nav.Link href="#" className="d-md-flex align-items-center justify-content-center d-none text-muted p-0">{tokenAmount}<Image className="mx-2" src={ASSETS.logo} width={15} /></Nav.Link>
          <Nav.Link href="#" className="d-md-flex align-items-center justify-content-center d-none text-muted p-0">{coinAmount}<Image className="mx-2" src={ASSETS.native} width={15} /></Nav.Link>
        </>}
        {web3Service.isAuthenticated && <Nav.Link href="#" onClick={logout} title="Logout"><FontAwesomeIcon icon={faSignOutAlt} className="text-muted" /><span className="d-sm-none ms-1 text-muted">Logout</span></Nav.Link>}
      </div>
      </Navbar.Collapse></>
  }
  return <>
    <ToastContainer position="middle-center" className="position-fixed" >
      <Toast onClose={() => showAlert({ show: false })} show={alert.show} delay={ALERT_TIMEOUT} autohide bg={alert.type && alert.type.toLowerCase()}>
        <Toast.Body>{alert.message}</Toast.Body>
      </Toast>
    </ToastContainer>
    <Navbar bg="white" variant="light" expand="sm" fixed="top">
      <Container className="d-flex d-sm-none" style={{ overflowY: "scroll", maxHeight: "calc(100vh - 10px)" }}>
        {children()}
      </Container>
      <Container className="d-none d-sm-flex">
        {children()}
      </Container>
    </Navbar>
  </>;
}
export default NavbarComponent;
