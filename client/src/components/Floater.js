import React from 'react'
import Paper from '@mui/material/Paper';
import Map2d from "../components/Map2d"
import InfoPanel from './InfoPanel';
import ActionPanel from './ActionPanel';



function Floater({ socket }) {
  return (
    <div className='floater'>
      <Paper sx={{height: "100%", width: "100%"}} elevation={3}>
        <Map2d socket={socket}></Map2d>
        <InfoPanel socket={socket}/>
      </Paper>
    </div>
  )
}

export default Floater