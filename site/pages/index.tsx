import React, { } from 'react';
import Head from 'next/head';
import { Container } from "react-bootstrap";

const IndexPage = () => (
  <>
    <div>
    <header>
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">W3 DAO</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Project</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Tokenomics</a>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled">Partners</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    
    <main>
    </main>
    </div>
  </>
)

export default IndexPage
