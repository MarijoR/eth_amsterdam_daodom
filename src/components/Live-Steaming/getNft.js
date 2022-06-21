import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import { useState } from 'react';
import ConnectWallet from './ForNft.js/ConnectWallet';
import { AppBar } from '@mui/material';
import "../../styles/App.css";
import Nft from './ForNft.js/Nft';

const theme = createTheme();


export default function GetNft() {
const [chainId, setChainId] = useState("");
const [address, setAddress] = useState("");
const [appState, setAppState] = useState("Ready to mint");
console.log({ chainId })
  return (
    <div className="App">
    <header className="App-header">
     {
       !address && (
         <ConnectWallet setChainId={setChainId} setAddress={setAddress} />
       )
     }
     {
       chainId && (
         <Nft 
          appState={appState}
          setAppState={setAppState}
          chainId={chainId}
         />
       )
     }
    </header>
  </div>
  );
}