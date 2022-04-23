import Header from "components/Header";
import { useAuthUser } from "lib/firebase";
import CreatePost from "pages/CreatePost";
import Home from "pages/Home";
import MultiSigGnosis from "pages/MultisigGnosis";
import Login from "pages/Login";
import Signup from "pages/Signup";
// import { CreateFlow } from "./components/SuperFluid/CreateFlow"
import { Route, Switch } from "react-router-dom";

export default function App() {
  useAuthUser()

  return <>
  <Route component={Header} />
  <Switch>
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    {/* <Route path="/createjob" component={CreateFlow} /> */}
    <Route path="/multisig" component={MultiSigGnosis} />
    <Route path="/createpost" component={CreatePost} />
    <Route path="/" component={Home} />



  </Switch>
  </>;
}
