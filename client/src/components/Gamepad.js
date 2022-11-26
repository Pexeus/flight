import { getOptionGroupUnstyledUtilityClass } from '@mui/base'
import React, { useEffect, useState } from 'react'
import gamepads from '../gamepads'

function Gamepad({ socket }) {
    const [gp, setGP] = useState(false)
    let currentValues = {}
    let qualityTimeout = false

    function init() {
        console.log("waiting for gamepad");
    
        window.addEventListener("gamepadconnected", e => {
            console.log(e);
            console.log("Gamepad connected:", e.gamepad.id)
            setGP(e.gamepad.id)
            updateControls()
        })
    }

    async function updateControls() {
        const gamepad = navigator.getGamepads()[0];
        const updater = gamepads[gamepad.id]
        console.log(gamepad);
        
        setInterval(() => {
            const gamepad = navigator.getGamepads()[0];
            updater(gamepad, socket)
        }, 20);
    }

    useEffect(() => {
        init(socket)
    }, [])

    return (
        <div>
            {gp ? (
                <p>Gamepad: {gp}</p>
            ) : (
                <p>No Gamepad Connected</p>
            )}
        </div>
    )
}

export default Gamepad