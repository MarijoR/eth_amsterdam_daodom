import { ethers } from "ethers";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

export default function ConnectWallet({ setChainId, setAddress}) {
  const handleWalletConnect = async () => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAddress(address);
      const { chainId } = await provider.getNetwork();
      setChainId(chainId);
      console.log(address);
    } else {
      alert("No Wallet Detected");
    }
  };
  return (
    <Container component="main" maxWidth="xs">
    <Button
    fullWidth
    variant="contained"
    sx={{ mt: 3, mb: 2 }}
    onClick={() => handleWalletConnect()}
  >
    Connect Wallet
  </Button>
  </Container>
  );
}