import { React, useState, useEffect } from "react";
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import ButtonAppBar from "../components/ButtonAppBar";
import { ethers } from 'ethers'
import EthersAdapter from '@gnosis.pm/safe-core-sdk'
import Safe, { SafeFactory, SafeAccountConfig } from '@gnosis.pm/safe-core-sdk'
import { ContractNetworksConfig } from '@gnosis.pm/safe-core-sdk'
import web3 from 'web3';

export default function Gnosis() {


  const web3Provider = window.ethereum;
  //const web3Provider = web3.currentprovider;
  const provider = new ethers.providers.Web3Provider(web3Provider)
  //const provider = new ethers.providers.Web3Provider(web3Provider);
  const safeOwner = provider.getSigner()
  const ethAdapter = new EthersAdapter({
  ethers,
  signer: safeOwner
  })
    const createSafe = async () =>{
    const safeFactory =  await SafeFactory.create({ ethAdapter });
    
    const safeSdk =  await safeFactory.deploySafe({ safeAccountConfig });  
    safeSdk();
  }
  //const safeFactory = async () => await SafeFactory.create({ ethAdapter });

  const owners = ['0x9bfB07106c0Ce48B037aFb0757dd1C5eb94b20cA', '0x8Bc34a0823bFF3D1dF739E135aD2e332a9565C1b', '0x088006AFcD8130fd2AC61662c6c98E9B2e933Df3']
  const threshold = 3
  const safeAccountConfig = {
  owners,
  threshold,
  };

  
//const safeSdk = async () => await safeFactory.deploySafe({ safeAccountConfig });

//const newSafeAddress = safeSdk.getAddress();

{/*const getSafeAddress = async () =>{
  const newSafeAddress = safeSdk.getAddress();
  setSafe(newSafeAddress);
}*/}

//const ethAdapterOwner1 = '0x9bfB07106c0Ce48B037aFb0757dd1C5eb94b20cA';
//const safeAddress = '0x9bfB07106c0Ce48B037aFb0757dd1C5eb94b20cA';
//const safeSdkRetry = async () => await Safe.create({ ethAdapter: ethAdapterOwner1, safeAddress });

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("LOGIN");

  const [contract, setContract] = useState(null);

  const [safe, setSafe] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [balance, setBalance] = useState(null);

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Die Installation von MetaMask ist erforderlich");
      setErrorMessage("Bitte installieren Sie die MetaMask-Browsererweiterung");
    }
  };

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    if (connButtonText === "LOGOUT") {
      setConnButtonText("LOGIN");
      setDefaultAccount(null);
    } else {
      setConnButtonText("LOGOUT");
      setDefaultAccount(newAccount);
      updateEthers();
    }
  };

  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
  };


  return (
    <div>
<ButtonAppBar onConnect={connectWalletHandler} text={connButtonText} />
      <Box sx={{ flexGrow: 1 }} margin={2}>
        {defaultAccount ? (
          <Grid
            container
            alignItems="flex-start"
            justifyContent="center"
            spacing={2}
          >
            <Grid item xs={6}>
              <Card
                sx={{
                  pading: 20,
                  backgroundColor: "#EGDBCB",
                  maxWidth: 480,
                  minHeight: 160,
                }}
              >
                <Typography margin={3} variant="h5" color="#345DA7">
                  {" "}
                Meine Wallet Adresse:
                </Typography>

                <Typography variant="h6">{defaultAccount}</Typography>

                <Button
                  onClick={createSafe}
                  size="large"
                  variant="contained"
                  //marginTop={2}
                >
                  Deploy Safe
                </Button>
                {errorMessage}
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <Grid item xs={12} sx={{ alignSelf: "center" }}>
              <Typography
                gutterBottom
                variant="h4"
                component="div"
                color="primary"
                fontFamily={"sans-serif"}
              >
                Willkommen zu deinem Safe
              </Typography>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                color="primary"
                fontFamily={"sans-serif"}
              >
                Daily should never be missed -
                Marijo
              </Typography>
            </Grid>
          </Grid>
        )}
      </Box>
    </div>
  );
}