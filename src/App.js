import Header from "components/Header";
import { useAuthUser } from "lib/firebase";
import CreatePost from "pages/CreatePost";
import Home from "pages/Home";
import MultiSigGnosis from "pages/MultisigGnosis";
import Login from "pages/Login";
import Signup from "pages/Signup";
// import { CreateFlow } from "./components/SuperFluid/CreateFlow"
import { Route, Switch } from "react-router-dom";
import HomeAuth from "pages/HomeAuth";
import Sidebar from "components/Sidebar";
import Rightbar from "components/Rightbar";
import Blog from "components/Blog";
import NewStory from "pages/NewStory";
import MyBlogs from "pages/MyBlogs";
import logo from "./images/chaincentive.png";
import { useMoralis } from "react-moralis";
import { ConnectButton } from "web3uikit";
import "./styles/App.css";

export default function App() {
  useAuthUser();
  const { isAuthenticated } = useMoralis();

  return <>
  <Route component={Header} />
  <Switch>
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    {/* <Route path="/createjob" component={CreateFlow} /> */}
    <Route path="/multisig" component={MultiSigGnosis} />
    <Route path="/createpost" component={CreatePost} />
    <Route path="/" component={Home} />
    <>
    {isAuthenticated ? (
        <div className="App">
          <div className="sideBar">
            <Sidebar />
            </div>
          <div className="mainWindow">
            <Switch>
    <Route path="HomeAuth/" component={HomeAuth} />
    <Route path="/newStory" component={NewStory} />
    <Route path="/myBlogs" component={MyBlogs} />
    <Route path="/blog/:url" component={Blog} />
    </Switch>
    </div>
          <div className="rightBar">
            <Rightbar />
          </div>
        </div>
   ) : (
    <div className="unAuth">
        {/* <img src={logo} alt= "logo" height="200px"/> */}
        <img src={logo} alt= "logo" height="300px" />
        <ConnectButton />
    </div>

    )}
    </>

  </Switch>
  </>;
}
