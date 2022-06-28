import Header from "components/Header";
import { useAuthUser } from "lib/firebase";
import CreatePost from "pages/CreatePost";
import Home from "pages/Home";
import MultiSigGnosis from "pages/MultisigGnosis";
import Login from "pages/Login";
import Signup from "pages/Signup";
import Streams from "./components/Live-Steaming/Streams";
import YourStream from "./components/Live-Steaming/YourStream"
// import { CreateFlow } from "./components/SuperFluid/CreateFlow"
import { Route, Switch } from "react-router-dom";
import GetNft from "./components/Live-Steaming/getNft";
import Streamnote from "./components/Live-Steaming/streamnote";
import Testing from "./components/Snapshot/testing";
import Createproposal from "./components/Snapshot/Createproposal";

export default function App() {
  useAuthUser()

  return <>
  <Route component={Header} />
  <Switch>
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    {/* <Route path="/createjob" component={CreateFlow} /> */}
    <Route path="/multisig" component={MultiSigGnosis} />
    <Route path="/streams" component={Streams} />
    <Route path="/yourstream" component={YourStream} />
    <Route path="/proposals" component={Testing} />
    <Route path="/createproposals" component={Createproposal} />
    <Route path="/getnft" component={GetNft} />
    <Route path="/streamnote" component={Streamnote} />
    <Route path="/createpost" component={CreatePost} />
    <Route path="/" component={Home} />



  </Switch>
  </>;
}
