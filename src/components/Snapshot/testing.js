import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import ConnectWallet from './ConnectWalletSS';
import Proposal from './proposals';
import Createproposal from './Createproposal';

const theme = createTheme();


export default function Testing() {
const [chainId, setChainId] = useState("");
const [address, setAddress] = useState("");

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
         <Createproposal
   
         chainId = {chainId}
          address = {address}
         />
       )
     }
      
    </header>
  </div>
  );
}