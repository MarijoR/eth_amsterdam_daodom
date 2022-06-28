import { Web3Provider } from '@ethersproject/providers';
import snapshot from '@snapshot-labs/snapshot.js';
import Container from '@mui/material/Container';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { fetchJson } from 'ethers/lib/utils';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';



export default function Createproposal({chainId, address}) {

const hub = 'https://testnet.snapshot.org'; 
 const client = new snapshot.Client712(hub);
 const [title, setTitle] = useState("");
 const [body, setBody] = useState("");
 const [text, setText] = useState("");
 const [type, setType] = useState("");


 const handleChange = (event) => {
  setType(event.target.value);
};
  
 const handleSubmit = e => {
  e.preventDefault();

  if (!title || !type) {
  setText("Please do not leave empty!")
  } else {
  setText("")
  Create();
  }
};
  

async function Create() {

const web3 = new Web3Provider(window.ethereum);
let account = address;

const receipt = await client.proposal(web3, account, {
  space: 'zischan.eth',
  type: type,
  title: title,
  body: body,
  choices: ['Alice', 'Bob', 'Carol'],
  start: 1636984800,
  end: 1637244000,
  snapshot: 13620822,
  network: chainId,
  strategies: JSON.stringify({}),
  plugins: JSON.stringify({}),
  metadata: JSON.stringify({})
});
}


return (
  <Container component="main" maxWidth="xs">
  <form  id="myForm" onSubmit={handleSubmit}>
  <TextField 
    error={!!text}
    helperText={text}
   fullWidth
  id="outlined-basic" 
  label="Title" 
  variant="outlined" 
  onChange={e => setTitle(e.target.value)}
    />
     <TextField 
   fullWidth
  id="outlined-basic" 
  label="Description (optional)" 
  variant="outlined" 
  onChange={e => setBody(e.target.value)}
    />

<Select
      autoWidth
      value={type}
      label="Voting system"
      onChange={handleChange}
      error={!!text}
    helperText={text}
    >
      <MenuItem value='single-choice'>Single choice voting</MenuItem>
      <MenuItem value='approval'>Approval voting</MenuItem>
      <MenuItem value='quadratic'>Quadratic voting</MenuItem>
      <MenuItem value='ranked-choice'>Ranked choice voting</MenuItem>
      <MenuItem value='weighted'>Weighted voting</MenuItem>
      <MenuItem value='basic'>Basic voting</MenuItem>
    </Select>
   
<Button
      type="submit"
      form="myForm"
      fullWidth
      variant="contained"
      sx={{ mt: 3, mb: 2 }}
    >
      Create proposal
    </Button>
    </form>
</Container>

  );
}