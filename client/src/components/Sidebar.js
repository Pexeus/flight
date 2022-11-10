import React, {useState} from 'react'
import Drawer from '@mui/material/Drawer';
import { config, setConfig } from 'process';
import Setup from "./Setup"

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
        </Drawer>
    </div>
    )
}

export default Sidebar