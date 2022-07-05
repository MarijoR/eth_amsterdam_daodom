import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import ConnectWallet from './ConnectWalletSS';
import Proposal from './proposals';
import Createproposal from './Createproposal';
import Information from './informations';

const theme = createTheme();


export default function Testing() {
const [chainId, setChainId] = useState("");
const [address, setAddress] = useState("");
const [cardId, setCardId] = useState("");
const [go, setGo] = useState("");

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
       chainId && !cardId && !go &&(
         <Proposal
   
         chainId = {chainId}
          address = {address}
          setCardId = {setCardId}
          setGo = {setGo}
         />
       )
     }
       {
       cardId && go && (
         <Information
   
         chainId = {chainId}
          address = {address}
          cardId = {cardId}
          go = {go}
         />
       )
     }
      
    </header>
  </div>
  );
}