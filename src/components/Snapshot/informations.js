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
import { useHistory } from "react-router-dom";
import Createproposal from './Createproposal';
import { ConstantFlowAgreementV1 } from '@superfluid-finance/sdk-core';

export default function Information({chainId, address, cardId, go}) {
    let history = useHistory();
const hub = 'https://testnet.snapshot.org'; 
 const client = new snapshot.Client712(hub);
 const [title, setTitle] = useState("");
 const [body, setBody] = useState("");
 const [text2, setText2] = useState(0);
const [type, setType] = useState("");

  const headers = { 
    'Content-Type': 'application/json'
  }

async function Cast(t) {
  setType(t);
  const web3 = new Web3Provider(window.ethereum);
let account = address;

  const receipt = await client.vote(web3, account, {
    space: 'zischan.eth',
    proposal: `${cardId}`,
    type: type,
    choice: text2+1,
    metadata: JSON.stringify({})
  });
}

  const [text, setText] = useState([]);
  const [choice, setChoice] = useState([]);
  const axios = require('axios');

useEffect(() =>{
  async function fetchData() {
  const data = JSON.stringify({
    query: `query Proposals {
    proposals (
      skip: 0,
      where: {
        space_in: ["zischan.eth"],
        id: "${cardId}",
      },
      orderBy: "created",
      orderDirection: desc
    ) {
      id
      type
      title
      body
      choices
      start
      end
      snapshot
      state
      author
      space {
        id
        name
      }
    }
  }`,
    variables: {}
  });

  await axios.post('https://testnet.snapshot.org/graphql', data, {
  headers: headers
})
/*.then ((response) => { 
const result =response.data.map(d => ({
author: d.author,
title2: d.title,
active: d.state,
text: d.body,
end: d.end,
start: d.start,
}))
}) */
.then(function (response) {
  console.log(JSON.stringify(response.data));
  setText(response.data.data.proposals);
})
.catch(error => {
  console.log(error);
});
  }
fetchData()
}, []);

return (
  
          <div>
          { text.map(function (item, index) { return ( 
          <>
            <Typography variant="h1" key={index}>
            {item.title}
            </Typography>
            <Button color="secondary" variant="contained">{item.state}</Button>
            <Typography variant="h6" key={index}>
              {item.body}
            </Typography>
                 
      <Typography variant="h4" key={index}>
             Cast your vote
             </Typography>   
             <div>
         {item.choices.map( function (subitem, i) { return (
                  <Button fullWidth variant="outlined" key={i}   onClick={() => setText2(i)}> {subitem}</Button>
                  )})
                }
       </div>
       <Button variant="contained" fullWidth  onClick= {()=> {Cast(item.type)}}> Vote</Button>
            </>
                
        )})
      }
              </div>
           
  );
}