let currentValues = false
let qualityTimeout = false
let currentCameraPos = 1400
let lastCameraPos = 1400
let currentZoomLevel = 1

function enableTimeout() {
    qualityTimeout = true
    setTimeout(() => {
        qualityTimeout = false
    }, 500);
} 

function ps4Controller(gamepad, socket) {
    if (gamepad != undefined) {
        //panic mode
        if (gamepad.buttons[10].pressed && gamepad.buttons[11].pressed && window.pilotMode == "enabled") {
            window.disablePilotMode()
            window.alert("Panic Mode: Disabling Control", "warning", 3000)
            enableTimeout()
        }
        
        const thrust = ((gamepad.buttons[7].value)).toFixed(2) * 900


        //controls
        const values = {
            roll: gamepad.axes[2].toFixed(1) * 1000,
            pitch: gamepad.axes[3].toFixed(1) * -1000,
            yaw: gamepad.axes[0].toFixed(1) * -1000,
            thrust: thrust
        }

        if (JSON.stringify(values) != JSON.stringify(currentValues)) {
            if (window.pilotMode == "enabled") {
                console.log(values);
                socket.emit("manual_control_send", values)
            }

            currentValues = values
        }

        //set camera pos
        if (gamepad.buttons[15].pressed) {
            currentCameraPos -= 40
        }
        if (gamepad.buttons[14].pressed) {
            currentCameraPos += 40
        }
        if (gamepad.buttons[0].pressed) {
            currentCameraPos = 1400
        }

        if (currentCameraPos < 600) {
            currentCameraPos = 600
        }
        if (currentCameraPos > 2200) {
            currentCameraPos = 2200
        }

        if (currentCameraPos != lastCameraPos) {
            socket.emit("rc_channel_override", {channel: 9, pwm: currentCameraPos})
            lastCameraPos = currentCameraPos
        }

        //take high res image
        if (gamepad.buttons[2].pressed) {
            if (!qualityTimeout) {
                window.alert("Taking Picture...", "info", 3000)

                socket.emit("camera_still", {width: 1920, height: 1080})
                enableTimeout()
            }
        }
        
        //set video quality
        if (!qualityTimeout) {
            if (gamepad.buttons[12].pressed) {
                socket.emit("video_bitrate_factorize", 1.2)
                window.alert("Updating Video Quality", "info", 3000)
                enableTimeout()
            }
            if (gamepad.buttons[13].pressed) {
                socket.emit("video_bitrate_factorize", 0.8)
                window.alert("Updating Video Quality", "info", 3000)
                enableTimeout()
            }
        }

        //set zoom level
        if (gamepad.buttons[1].pressed) {
            if (!qualityTimeout) {
                currentZoomLevel = currentZoomLevel - 0.45
                if (currentZoomLevel < 0) {
                    currentZoomLevel = 1
                }

                window.alert(`Zoom: ${(currentZoomLevel.toFixed(1))}`, "info", 3000)

                socket.emit("camera_zoom", currentZoomLevel)
                enableTimeout()
            }
        }
    }
}

function attack3(gamepad, socket) {
    if (gamepad == undefined) {
        return
    }

    //panic mode
    if (gamepad.buttons[1].pressed && gamepad.buttons[2].pressed && window.pilotMode == "enabled") {
        window.disablePilotMode()
        window.alert("Panic Mode: Disabling Control", "warning", 3000)
        enableTimeout()
    }

    //thrust
    const thrust = (0.5 + (gamepad.axes[2].toFixed(1) * -1 / 2)) * 900
    
    //controls
    const values = {
        roll: Math.round(gamepad.axes[0].toFixed(1) * 1000),
        pitch: Math.round(gamepad.axes[1].toFixed(1) * -1000),
        yaw: 0,
        thrust: Math.round(thrust)
    }

    //set video quality
    if (!qualityTimeout) {
        if (gamepad.buttons[5].pressed) {
            socket.emit("video_bitrate_factorize", 1.2)
            window.alert("Updating Video Quality", "info", 3000)
            enableTimeout()
        }
        if (gamepad.buttons[6].pressed) {
            socket.emit("video_bitrate_factorize", 0.8)
            window.alert("Updating Video Quality", "info", 3000)
            enableTimeout()
        }
    }

    if (JSON.stringify(values) != JSON.stringify(currentValues)) {
        if (window.pilotMode == "enabled") {
            socket.emit("manual_control_send", values)
        }

        currentValues = values
    }
}

export default {
    "Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)": (gamepad, socket) => {
        ps4Controller(gamepad, socket)
    },
    "DUALSHOCK 4 Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)": (gamepad, socket) => {
        ps4Controller(gamepad, socket)
    },
    "Logitech Attack 3 (Vendor: 046d Product: c214)": (gamepad, socket ) => {
        attack3(gamepad, socket)
    }
}