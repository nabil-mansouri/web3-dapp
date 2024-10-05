import React from 'react';
import { Button, Container, Card, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faHourglass, faHourglassStart } from '@fortawesome/free-solid-svg-icons';
import { appService, formatNumber } from '../../components/services';
import { ALERT_TIMEOUT, useAlert, useSafeState, useAuthenticatedEffect } from '../../components/hooks';
import LoginGuard from "../../components/loginGuard";
import { LandDetails, LandModel } from '../../../contract/dist/src/services/splitService';

type IndexState = {
  loading: boolean
  date?:Date
  view?:LandModel<string>
  list: LandModel<string>[]
  screen: "list" | "form" | "view";
}
const Index = (props:{mine?:boolean}) => {
  const onReload = () =>{}
  return <LoginGuard onReload={onReload}>
    <Container className="app-screen-size d-flex align-content-center align-items-center justify-content-center">
        <Container className="d-flex flex-column max-w400px text-center align-items-center">
          <div className="max-w150px m-2 rounded-circle ratio ratio-1x1 d-flex align-items-center justify-content-center bg-dark-02">
            <FontAwesomeIcon style={{ position: "initial" }} className="fa-4x text-light" icon={faHourglassStart} />
          </div>
          <Container as="h1" className="mt-2 text-dark">Coming soon</Container>
          <Container as="p" className="mt-2 my-3 fs-5">Follow use and stay tune for this feature</Container>
        </Container>
      </Container></LoginGuard>
};

export default Index;
