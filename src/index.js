import 'lib/date-config';
// import AppProviders from "AppProviders";
import ReactDOM from "react-dom";
import "styles/index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { createRoot } from 'react-dom/client';
import React from 'react';
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import { BrowserRouter as Router } from "react-router-dom";
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = createRoot(rootElement);

// ReactDOM.render(
  // <AppProviders>
  //   <App />
  // </AppProviders>,
  // document.getElementById("root")
  root.render(
  <React.StrictMode>
    <MoralisProvider
      initializeOnMount
      appId={"JVmVRhHRQpENMcVquiNmzqUg2rRNylXJWlaFl5MX"}
      serverUrl={"https://btn15x3goukm.usemoralis.com:2053/server"}
    >
      <NotificationProvider>
        <Router>
          <App />
        </Router>
      </NotificationProvider>
    </MoralisProvider>
  </React.StrictMode>
);

serviceWorker.unregister();
