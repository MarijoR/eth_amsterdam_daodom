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

export default function Information({chainId, address, cardId, go}) {
    let history = useHistory();
const hub = 'https://testnet.snapshot.org'; 
 const client = new snapshot.Client712(hub);
 const [title, setTitle] = useState("");
 const [body, setBody] = useState("");

  const headers = { 
    'Content-Type': 'application/json'
  }


  const [text, setText] = useState([]);
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
     <div>
   <Container component="main" maxWidth="xs">
    <Button
    fullWidth
    variant="contained"
    sx={{ mt: 5, mb: 2 }}
    onClick={() =>   history.replace('/createproposal')}
  >
    Create your proposal
  </Button>
  </Container>
  </div>
          <div>
          { text.map(function (item, index) { return ( 
          <Card sx={{ minWidth: 400, minHeight: 20, marginTop: 4, mb: 2 }}>
          <CardContent>
          <Typography sx={{ fontSize: 16 }} color="text.secondary" key={index}>
            </Typography>
            <Typography sx={{ fontSize: 16 }} color="text.secondary" key={index}>
            {item.title}
            </Typography>
            <Typography variant="h6" component="div" key={index}>
              {item.body}
            </Typography>
          </CardContent>
          <CardActions>
            <Button 
             key={index}
      
            size="small">Learn More</Button>
          </CardActions>
        </Card>
        )})
      }
           </div>
           </div>
  );
}