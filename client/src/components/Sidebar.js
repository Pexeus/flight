import React, {useState} from 'react'
import Drawer from '@mui/material/Drawer';
import { config, setConfig } from 'process';
import Setup from "./Setup"
import TerminalWindow from './TerminalWindow';

function Sidebar({socket}) {
    const [status, setStatus] = useState(false)
    const [conf, setConf] = useState(config)

    function toggleStatus(e) {
        setStatus(!status)
    }


    return (
    <div>
        <div className='sidebarListener' onMouseOver={toggleStatus}></div>
        <Drawer open={status} onClose={toggleStatus}>
            <Setup socket={socket}></Setup>
            <TerminalWindow socket={socket} open={status}></TerminalWindow>
        </Drawer>
    </div>
    )
}

export default Sidebar