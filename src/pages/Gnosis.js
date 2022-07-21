import { React, useState, useEffect } from "react";
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import { ethers } from "ethers";
//import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
//import Safe, { SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk";
//import { ContractNetworksConfig } from '@gnosis.pm/safe-core-sdk'
import { useMoralis } from "react-moralis";
//import SafeServiceClient from "@gnosis.pm/safe-service-client";
import Safe, { SafeFactory, EthersAdapter } from "@gnosis.pm/safe-core-sdk";

export default function Gnosis() {
  const [safeFactory, setSafeFactory] = useState("");
  const [safe, setSafe] = useState("");
  const [safeSdk, setSafeSdk] = useState("");
  const [safeaddress, setSafeAddress] = useState("");

  const owners = [
    "0x063e750Ab7F6bC6d70B7d18A170D0771a6D78927",
    "0x3E6f83CAd0B7af12838dbe3d8b7aaaA11FE02FB5",
    "0xfEEB45B502EaEF26f6a5d1918e67406D41404ad0",
  ];
  const threshold = 3;

  const MULTI_SEND_ADDRESS = "0xA470120a5B2875842b9Cf8a2e342beDC6b7DBe4E";
  const MASTER_COPY_ADDRESS = "0x5a05f7003a11612687b664718FC3AD1D2ee900da";
  const PROXY_FACTORY_ADDRESS = "0x82FAC758b3670A82BF7F815db6291c151DE023cE";

  async function createSafe(owners, threshold) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const safeOwner = provider.getSigner(0);
    const adapter = new EthersAdapter({ ethers, signer: safeOwner });
    const id = await adapter.getChainId();
    try {
      const contractNet = {
        [id]: {
          multiSendAddress: MULTI_SEND_ADDRESS,
          safeMasterCopyAddress: MASTER_COPY_ADDRESS,
          safeProxyFactoryAddress: PROXY_FACTORY_ADDRESS,
        },
      };

      try {
        console.log("ethAdapter:", adapter);
        const factory = await SafeFactory.create({
          ethAdapter: adapter,
          contractNetworks: contractNet,
        });
        console.log("factory: ", factory);
        setSafeFactory(factory);
        if (!safeaddress) return;

        const safeSdk = await Safe.create({
          ethAdapter: adapter,
          safeaddress /*, contractNetworks*/,
        });

        setSafeSdk(safeSdk);
      } catch (error) {
        console.error("error:", error);
      }

      console.log(safeFactory);
      if (!safeFactory) return;
      console.log("SI HAY UNA safefactory");

      const safeAccountConfig = { owners, threshold };
      console.log(
        "CONFIGURACION DEL SAFE CON LAS VARIABLE OWNER Y THRESHOLD: safeAccountConfig",
        safeAccountConfig
      );
      let safe;
      try {
        safe = await safeFactory.deploySafe(safeAccountConfig);
        console.log("CONS SAFE DESPUES DE HABER LLAMADO DEPLOYSAFE:", safe);
      } catch (error) {
        console.error(error);
        return;
      }
      const newSafeAddress = ethers.utils.getAddress(safe.getAddress());
      setSafeAddress(newSafeAddress);
      console.log("newSafeAddress: ", newSafeAddress);
    } catch (error) {
      console.log(error);
    }
  }

  /*  const createSafe1 = async () => {
    console.log("test");
    //const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log("provider: ", provider);

    //const signer = provider.getSigner();
    console.log("signer: ", signer);
   // const safeOwner = provider.getSigner(0);
    console.log("safeOwner: ", safeOwner);

//    const ethAdapter = new EthersAdapter({ ethers, signer: safeOwner });
    console.log("ethAdapter: ", ethAdapter);

    const id = await ethAdapter.getChainId();
    console.log("id: ", id);
    console.log("Safe: ", Safe);
    console.log("SafeFactory: ", SafeFactory.create);

    const txServiceUrl = "https://safe-transaction.gnosis.io";
    const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter });
    console.log("safeService: ", safeService);

    try {
      const safeFactory = await SafeFactory.create({ ethAdapter });
      console.log("safeFactory: ", safeFactory);
    } catch (error) {
      console.log("error: ", error);
    }

    /*     const safeSdk = await Safe.create({ ethAdapter, safeaddress });
    console.log("safeSdk: ", safeSdk); */

  /* const safeSdk = await Safe.deploy({ ethAdapter, safeaddress });

    const safeFactory = await SafeFactory.create({ ethAdapter, safeaddress });
*/
  /* setSafeFactory(safeFactory());
    console.log("test2");
    //const safeSdk  =  await Safe.deploySafe({ safeAccountConfig, });
    setSafe(safeSdk());
    console.log("test3");
    setSafeAddress(safeSdk.getAddress());
    console.log(safeaddress);
    console.log(safe); 
  }; */

  //const safeFactory = async () => await SafeFactory.create({ ethAdapter });

  /* const owners = [
    "0x063e750Ab7F6bC6d70B7d18A170D0771a6D78927",
    "0x3E6f83CAd0B7af12838dbe3d8b7aaaA11FE02FB5",
    "0xfEEB45B502EaEF26f6a5d1918e67406D41404ad0",
  ];
  const threshold = 3; 
  const safeAccountConfig = {
    owners,
    threshold,
  };*/

  //const safeSdk = async () => await safeFactory.deploySafe({ safeAccountConfig });

  //const newSafeAddress = safeSdk.getAddress();

  /* {
    const getSafeAddress = async () =>{
  const newSafeAddress = safeSdk.getAddress();
  setSafe(newSafeAddress);
}
  }*/

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

  const {
    authenticate,
    isAuthenticated,
    isAuthenticating,
    user,
    account,
    logout,
  } = useMoralis();

  useEffect(() => {
    if (isAuthenticated) {
      // add your logic here
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const login = async () => {
    if (!isAuthenticated) {
      await authenticate({ signingMessage: "Log in using Moralis" })
        .then(function (user) {
          console.log("logged in user:", user);
          console.log(user.get("ethAddress"));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const logOut = async () => {
    await logout();
    console.log("logged out");
  };

  return (
    <div>
      <button onClick={login}>Moralis Metamask Login</button>
      <button onClick={logOut} disabled={isAuthenticating}>
        Logout
      </button>
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
                Daily should never be missed - Marijo
              </Typography>
            </Grid>
          </Grid>
        )}
      </Box>
    </div>
  );
}
