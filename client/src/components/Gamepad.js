import React, { useEffect, useState } from 'react'

function Gamepad({ socket }) {
    const [gp, setGP] = useState(false)
    let currentValues = {}
    let qualityTimeout = false

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

        //TEMPORARY (shit controller)
        if (!qualityTimeout) {
            if (gamepad.axes[9]) {
                if (gamepad.axes[9] == -1) {
                    enableQualityTimeout()
                    socket.emit("video_bitrate_factorize", 1.2)
                }
                if (gamepad.axes[9].toFixed(2) == 0.14) {
                    enableQualityTimeout()
                    socket.emit("video_bitrate_factorize", 0.8)
                }
            }
            else {
                if (gamepad.axes[7] == -1) {
                    enableQualityTimeout()
                    socket.emit("video_bitrate_factorize", 1.2)
                }
                if (gamepad.axes[7].toFixed(2) == 0.14) {
                    enableQualityTimeout()
                    socket.emit("video_bitrate_factorize", 0.8)
                }
            }
        }
    
        if (gamepad != undefined) {           
            const values = {
                roll: gamepad.axes[2].toFixed(2) * 1000,
                pitch: gamepad.axes[5].toFixed(2) * -1000,
                yaw: gamepad.axes[0].toFixed(2) * -1000,
                thrust: ((gamepad.axes[4] + 1) / 2).toFixed(2) * 1000
            }

            if (JSON.stringify(values) != JSON.stringify(currentValues)) {
                if (window.pilotMode == "enabled") {
                    socket.emit("manual_control_send", values)
                }

                currentValues = values
            }
    
            setTimeout(() => {
                updateControls();
            }, 10);
        }

        function enableQualityTimeout() {
            qualityTimeout = true
            setTimeout(() => {
                qualityTimeout = false
            }, 500);
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