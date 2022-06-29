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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import addWeeks from 'date-fns/addWeeks';
import * as React from 'react';

export default function Createproposal({chainId, address}) {
 

const hub = 'https://testnet.snapshot.org'; 
 const client = new snapshot.Client712(hub);
 const [title, setTitle] = useState("");
 const [body, setBody] = useState("");
 const [text, setText] = useState("");
 const [type, setType] = useState("");
 const [choices, setChoices] = useState("");
 const [text2, setText2] = useState("");
 const [text3, setText3] = useState("");
 const [item, setItem] = useState([]);
 const [value, setValue] = useState([null, null]);

 
console.log(value);

function getWeeksAfter(date, amount) {
  return date ? addWeeks(date, amount) : undefined;
}

 const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: 300,
    margin: 100,
  },
  //style for font size
  resize:{
    fontSize:50
  },
}

 const handleCounter = () => {
   console.log(item, "item");
   setItem([...item, ""]);
 };

 const setInput = (index) => (event) => {
   item.splice(index, 1, event.target.value);
   setItem([...item]);
 };


 const handleChange = (event) => {
  setType(event.target.value);
};
  
 const handleSubmit = e => {
  e.preventDefault();

  if (!title) {
  setText("Please fill in a Title!")
  } else {
  setText("")
  } if(!type) {
  setText2("Please choose a Voting-System!")
} else {
  setText2("")
 } if(item[0] == "") {
  setText3("Please fill in choices!")
   } else {
  setText3("")
    } if(title && type && item[0] != "") {
  Create()
  .catch(error => {
    console.log(error);
    alert("Something went wrong!")
  });

  }
};
  

async function Create() {

const web3 = new Web3Provider(window.ethereum);
let account = address;
const start = value[0].getTime() / 1000;
const end = value[1].getTime() / 1000;

const receipt = await client.proposal(web3, account, {
  space: 'zischan.eth',
  type: type,
  title: title,
  body: body,
  choices: item,
  start: start,
  end: end,
  snapshot: 13620822,
  network: chainId,
  strategies: JSON.stringify({}),
  plugins: JSON.stringify({}),
  metadata: JSON.stringify({})
});
alert("Successfully posted!");
}


return (
  <Container component="main" maxWidth="xs">
  <form  id="myForm" onSubmit={handleSubmit}>
  <TextField 
    error={!!text}
    helpertext={text}
   fullWidth
  id="outlined-basic" 
  label="Title" 
  variant="outlined" 
  onChange={e => setTitle(e.target.value)}
    />
     <TextField 
   fullWidth
   margin="normal"
  id="outlined-basic" 
  size="medium"
  label="Description (optional)" 
  variant="outlined" 
  onChange={e => setBody(e.target.value)}
    />

<TextField
      fullWidth
      select
      value={type}
      label="Voting system"
      onChange={handleChange}
      margin="normal"
      error={!!text2}
    helpertext={text2}
    >
      <MenuItem value='single-choice'>Single choice voting</MenuItem>
      <MenuItem value='approval'>Approval voting</MenuItem>
      <MenuItem value='quadratic'>Quadratic voting</MenuItem>
      <MenuItem value='ranked-choice'>Ranked choice voting</MenuItem>
      <MenuItem value='weighted'>Weighted voting</MenuItem>
      <MenuItem value='basic'>Basic voting</MenuItem>
    </TextField>
    <div>
      {item.map((c, index) => {
        return (
          <TextField
            error={!!text3}
           helpertext={text3}
            key={index}
            label={`Choice ${index+1}`}
            value={c}
            onChange={setInput(index)}
            fullWidth
          />
        );
      })}
    </div>
      <Button 
      fullWidth
      margin="normal"
      onClick={handleCounter}>Add a Choice</Button>
    
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker
        disablePast
        value={value}
        maxDate={getWeeksAfter(value[0], 4)}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <TextField {...startProps} />
            <Box sx={{ mx: 1 }}> </Box>
            <TextField {...endProps} />
          </React.Fragment>
        )}
      />
    </LocalizationProvider>
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