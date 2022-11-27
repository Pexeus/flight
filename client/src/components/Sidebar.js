import React, {useState, useEffect} from 'react'
import Drawer from '@mui/material/Drawer';
import { config, setConfig } from 'process';
import Setup from "./Setup"
import TerminalWindow from './TerminalWindow';

function Sidebar({socket}) {
    const [status, setStatus] = useState(false)
    const [conf, setConf] = useState(config)

    useEffect(() => {
        window.toggleSidebar = () => {
            console.log("toggling", status);
            setStatus(cur => {
                return !cur
            })
        }
    }, [])

    return (
        <div>
            <Drawer open={status} onClose={window.toggleSidebar}>
                <Setup socket={socket}></Setup>
                <TerminalWindow socket={socket} open={status}></TerminalWindow>
            </Drawer>
        </div>
    )
}

export default Sidebar