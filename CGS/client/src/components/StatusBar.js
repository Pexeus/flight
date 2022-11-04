import React from 'react'
import Gamepad from "./Gamepad"

function StatusBar() {
    return (
        <div className='statusBar' style={{ backgroundColor: window.theme.palette.primary["main"] }}>
            <Gamepad/>
        </div>
    )
}

export default StatusBar