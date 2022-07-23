import { React, useState, useEffect } from "react";
import ConnectButton from "components/shared/ConnectButton";
import { Box, Button, Card, Grid, Typography } from "@mui/material";
import { ethers } from "ethers";
import Safe, { SafeFactory, EthersAdapter } from "@gnosis.pm/safe-core-sdk";

export default function Gnosis() {
  const [safeFactory, setSafeFactory] = useState("");
  const [safe, setSafe] = useState("");
  const [safeSdk, setSafeSdk] = useState("");
  const [safeaddress, setSafeAddress] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const OWNERS = [
    "0x063e750Ab7F6bC6d70B7d18A170D0771a6D78927",
    "0x3E6f83CAd0B7af12838dbe3d8b7aaaA11FE02FB5",
    "0xfEEB45B502EaEF26f6a5d1918e67406D41404ad0",
  ];
  const THRESHOLD = 3;

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    const chain = await window.ethereum.request({ method: "eth_chainId" });
    let chainId = chain;
    console.log("chain ID:", chain);
    console.log("global Chain Id:", chainId);
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  async function deploySafe(owners, threshold) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const safeOwner = provider.getSigner(0);
    const ethAdapter = new EthersAdapter({ ethers, signer: safeOwner });
    const id = await ethAdapter.getChainId();
    try {
      const safeFactory = await SafeFactory.create({ ethAdapter });
      console.log("safeFactory: ", safeFactory);
      setSafeFactory(safeFactory);

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

      if (safeaddress) {
        const safeSdk = await Safe.create({
          ethAdapter,
          safeaddress,
        });

        setSafeSdk(safeSdk);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {currentAccount === "" ? (
        <Grid container alignItems="center" justifyContent="center" spacing={2}>
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
            <ConnectButton onClick={connectWallet} />
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ flexGrow: 1 }} margin={2}>
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

                <Typography variant="h6">{`${currentAccount.substring(
                  0,
                  5
                )}...${currentAccount.substring(38)}`}</Typography>

                <Typography margin={3} variant="h5" color="#345DA7">
                  {" "}
                  Meine Safe Adresse:
                </Typography>

                <Typography variant="h6">{safeaddress}</Typography>

                <Button
                  onClick={() => deploySafe(OWNERS, THRESHOLD)}
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
        </Box>
      )}
    </div>
  );
}
