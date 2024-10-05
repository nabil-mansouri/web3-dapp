# Web3 App

A dapp that allow splitting lands and exchange it throught an order.
Written using reactjs and solidity (smart contracts)

# Worker

A cors proxy used by dapp (and deployed into cloudflare)

## Getting started

Require Node12+ (use nvm to switch node version)

Install nvm

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm use 12
``` 


### DApp

Start site in dev mode using

> cd site && npm run dev

Access app at URL : http://localhost:3000/app/

Customise css using file *css/custom.css*

Create your app page using file *pages/app/index.tsx*

### Site

Start site in dev mode using

> cd site && npm i && npm run dev

Customise css using file *css/custom.css*

Create your index page using file *pages/index.tsx*

Access app at URL : http://localhost:3000/

*Use className instead of class attribute because of React syntax*

### Blockchain

#### Run tests

Start test

> cd contract && npm i && npm run test

#### Start blockchain

Start local blockchain

> cd contract && npm run run:local

Open another terminal and deploy contracts

> cd contract && npm run deploy:local
