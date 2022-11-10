import React from 'react'
import Gamepad from "./Gamepad"

function StatusBar({socket}) {
    return (
        <div className='statusBar' style={{ backgroundColor: window.theme.palette.primary["main"] }}>
            <Gamepad socket={socket}/>
        </div>
    )
}

export default StatusBar