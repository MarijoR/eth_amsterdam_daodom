import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LiveTv from '@mui/icons-material/LiveTv';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import { useState, useEffect } from 'react';


const theme = createTheme();


export default function YourStream() {

  const [id, setID] = useState("");
  const [key, setKey] = useState("");
    const headers = { 
      'Authorization': 'Bearer c3fa96b8-6956-4ed5-9a13-6f51c14d523e', 
      'Content-Type': 'application/json'
    }


useEffect( () =>{
    axios.get('https://livepeer.com/api/stream', {
  headers: headers
})
.then ((response) => { 
 const result =response.data.map(d => ({
  id: d.playbackId,
  active: d.isActive,
  streamkey: d.streamKey,
}))
for(var i = 0; i < result.length;i++) {
if(result[i].active === true) {
setID(result[i].id);
setKey(result[i].streamkey);
} else {
}
}
})
.catch(error => {
    console.log(error);
});
}, []);


console.log(id)
  return (
<div>
    <iframe
   
    src={`https://livepeercdn.com/hls/${id}/index.m3u8`}
    frameBorder="0"
    allow="autoplay; encrypted-media; picture-in-picture"
    width="100%"
    height="360"
    sandbox="allow-scripts"
    allowFullScreen
    >
  </iframe>
  </div>
  );
}