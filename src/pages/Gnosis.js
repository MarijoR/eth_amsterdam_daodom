import { React, useState, useEffect } from "react";
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import { ethers } from 'ethers'
import {EthersAdapter} from '@gnosis.pm/safe-core-sdk'
import Safe, { SafeFactory, SafeAccountConfig } from '@gnosis.pm/safe-core-sdk'
//import { ContractNetworksConfig } from '@gnosis.pm/safe-core-sdk'
import { useMoralis } from "react-moralis";
import { ContractNetworksConfig } from '@gnosis.pm/safe-core-sdk'


export default function Gnosis() {

  const [safeFactory, setSafeFactory] = useState("");
  const [safe, setSafe] = useState("");
  const [safeaddress, setSafeAddress] = useState("");


    const createSafe = async () =>{
    console.log("test");

    const web3Provider = window.ethereum;

  //const web3Provider = web3.currentprovider;
  const provider = new ethers.providers.Web3Provider(web3Provider)
  //const provider = new ethers.providers.Web3Provider(web3Provider);
  const safeOwner = provider.getSigner(0);

    const ethAdapter = new EthersAdapter({
      ethers,
      signer: safeOwner
      })
    const id = await ethAdapter.getChainId()

    const safeSdk = await Safe.deploy({ ethAdapter, safeaddress})
    const safeFactory =  await SafeFactory.create({ ethAdapter, safeaddress });
    setSafeFactory(safeFactory());
    console.log("test2")
    //const safeSdk  =  await Safe.deploySafe({ safeAccountConfig, });  
    setSafe(safeSdk());
    console.log("test3")
    setSafeAddress(safeSdk.getAddress());
    console.log(safeaddress);
    console.log(safe);
  }


  //const safeFactory = async () => await SafeFactory.create({ ethAdapter });

  const owners = ['0x9bfB07106c0Ce48B037aFb0757dd1C5eb94b20cA', '0x8Bc34a0823bFF3D1dF739E135aD2e332a9565C1b', '0x088006AFcD8130fd2AC61662c6c98E9B2e933Df3']
  const threshold = 3
  const safeAccountConfig  = {
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

  //const [safe, setSafe] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [balance, setBalance] = useState("");

  const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();

    useEffect(() => {
    if (isAuthenticated) {
      // add your logic here
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

    const login = async () => {
      if (!isAuthenticated) {

        await authenticate({signingMessage: "Log in using Moralis" })
          .then(function (user) {
            console.log("logged in user:", user);
            console.log(user.get("ethAddress"));
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }

    const logOut = async () => {
      await logout();
      console.log("logged out");
    }


  return (
    <div>
      <button onClick={login}>Moralis Metamask Login</button>
      <button onClick={logOut} disabled={isAuthenticating}>Logout</button>
      <Box sx={{ flexGrow: 1 }} margin={2}>
        {isAuthenticated ? (
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

                <Typography variant="h6">{user.get("ethAddress")}</Typography>

                <Typography margin={3} variant="h5" color="#345DA7">
                  {" "}
                Meine Safe Adresse:
                </Typography>
                
                <Typography variant="h6">{safeaddress}</Typography>

                <Button
                  onClick={createSafe}
                  size="large"
                  variant="contained"
                  //marginTop={2}
                >
                  Deploy Safe
                </Button>
                {errorMessage}
                {safeaddress}
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