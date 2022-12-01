import React from 'react'
import Gamepad from "./Gamepad"
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

function StatusBar({socket}) {
    return (
        <div className='statusBar' style={{ backgroundColor: window.theme.palette.primary["main"] }}>
            <div onClick={() => {window.toggleSidebar()}} style={{ backgroundColor: window.theme.palette.success["main"] }} className="toggleSidebar">
                <SettingsOutlinedIcon fontSize='small'></SettingsOutlinedIcon>
            </div>
            <Gamepad socket={socket}/>
        </div>
    )
}

export default StatusBar