import 'lib/date-config';
import AppProviders from "AppProviders";
import ReactDOM from "react-dom";
import "styles/index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker"
import { MoralisProvider } from "react-moralis";

ReactDOM.render(
  <AppProviders>
  <MoralisProvider serverUrl="https://ywbplvlv2bnz.usemoralis.com:2053/server" appId="oE3RK8zl0V8HfuD1k83XLfw1vfd014X61P5DUszK">
    <App />
  </MoralisProvider>
  </AppProviders>,
  document.getElementById("root")
);

serviceWorker.unregister();
