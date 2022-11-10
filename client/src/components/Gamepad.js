import React, { useEffect, useState } from 'react'

function Gamepad({ socket }) {
    const [gp, setGP] = useState(false)
    let currentValues = {}

    function init() {
        console.log("waiting for gamepad");
    
        window.addEventListener("gamepadconnected", e => {
            console.log("Gamepad connected:", e.gamepad.id)
            setGP(e.gamepad.id)
            updateControls()
        })
    }

    async function updateControls() {
        const gamepad = navigator.getGamepads()[0];
    
        if (gamepad != undefined) {
            
            const values = {
                roll: gamepad.axes[2].toFixed(4),
                pitch: gamepad.axes[5].toFixed(4),
                yaw: gamepad.axes[0].toFixed(4),
                thrust: ((gamepad.axes[4] + 1) / 2).toFixed(4)
            }

            if (JSON.stringify(values) != JSON.stringify(currentValues)) {
                socket.emit("rc_channels_override", values)
                currentValues = values
            }
    
            setTimeout(() => {
                updateControls();
            }, 10);
        }
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