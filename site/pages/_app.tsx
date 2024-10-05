import React from "react";
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { AppProps } from 'next/app';
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false
import '@fortawesome/fontawesome-svg-core/styles.css'
// add bootstrap css 
//import 'bootstrap/dist/css/bootstrap.css'
import "../css/style.css";
// own css files here
import "../css/custom.css";
import "../css/app.css";

const NoSsr = (props: any) => (
  <React.Fragment>{props.children}</React.Fragment>
)

const NOSSR = dynamic(() => Promise.resolve(NoSsr), {
  ssr: false
})
const MyApp = ({ Component, pageProps }: AppProps) => {
  return <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <NOSSR>
      <Component {...pageProps} />
    </NOSSR>
  </>
};

export default MyApp;
