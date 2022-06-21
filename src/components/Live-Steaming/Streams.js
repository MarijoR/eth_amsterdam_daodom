import React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import axios from "axios";
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import GetNft from './getNft';

export default function Streams({ history }) {

    const [isFormInvalid, setIsFormInvalid] = useState(false);
    const [api, setApi] = useState("");
    const [name, setName] = useState("");
    const [text, setText] = useState("");

    var axios = require('axios');

    const headers = { 
      'Authorization': 'Bearer c3fa96b8-6956-4ed5-9a13-6f51c14d523e', 
      'Content-Type': 'application/json'
    }


      const handleSubmit = e => {
        e.preventDefault();

        if (!name) {
        setText("Please Enter a Name for the Stream")
        } else {
        setText("")
        createStream();
        }
      };

async function createStream() {

const data = JSON.stringify({
  "name": name,
  "profiles": [
    {
      "name": "720p",
      "bitrate": 2000000,
      "fps": 30,
      "width": 1280,
      "height": 720
    },
    {
      "name": "480p",
      "bitrate": 1000000,
      "fps": 30,
      "width": 854,
      "height": 480
    },
    {
      "name": "360p",
      "bitrate": 500000,
      "fps": 30,
      "width": 640,
      "height": 360
    }
  ]
});

await axios.post('https://livepeer.com/api/stream', data, {
  headers: headers
})
.then(function (response) {
    history.replace('/streamnote');
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
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
          label="Stream Name" 
          variant="outlined" 
          onChange={e => setName(e.target.value)}
            />
           
        <Button
              type="submit"
              form="myForm"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Start your Stream
            </Button>
            </form>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => history.push('/getnft')}
            >
              Get Your NFT
            </Button>
      </Container>
 
  );
}
