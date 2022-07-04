import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";

export default function ButtonAppBar({ onConnect, text }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start">
            <Avatar alt="logo" src={"https://image-cache.xingcdn.com/images/attachments/265/133/698/original/7ea9f6d6_e9e4_4912_aff7_3c70ee600789.png?Expires=1657478131&Signature=rrVv2c1NGPQ-3uDRY0LUG885PH9T3BuwHAbYmV4nGQK-Jral9eyCBg-V8fBlOv08uUvXIgC2KVSOhHM0dICchmU1t9n4aJ9rE37c908Y-getvWLcM8QyJdvtSrObH86EhHtzkHKhNBjDlMXUPk1gMMw67mP6JAfUGELeZGMYcvbCxxX4puKnEzzqtWL698ASy3sSRt5S~RRj9UKDN9boZOm3dxjGB0CCyNaXCIvwUPIo6EpQdOOg3mk2Tw0g2bdDHceKoAi4iPGBrgttViQPYI8UqZhEc5pcv-C7dyxCuWfxEDnaDPXeCw2L~vN38SLlDvYgGNBb9vpk6XaYMFjZqQ__&Key-Pair-Id=APKAJ7DHXHPGL3QFZP4Q"} sx={{ width: 56, height: 56 }} />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gnosis
          </Typography>
          <Button onClick={onConnect} color="inherit">
            {text}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
