import React from 'react'
import Gamepad from "./Gamepad"
import TerminalIcon from '@mui/icons-material/Terminal';

function StatusBar({socket}) {
    return (
        <div className='statusBar' style={{ backgroundColor: window.theme.palette.primary["main"] }}>
            <Gamepad socket={socket}/>
            <TerminalIcon color='secondary'></TerminalIcon>
        </div>
    )
}

export default StatusBar