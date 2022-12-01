let currentValues = false
let qualityTimeout = false

function enableQualityTimeout() {
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
        }
        
        //controls
        const values = {
            roll: gamepad.axes[2].toFixed(1) * 1000,
            pitch: gamepad.axes[3].toFixed(1) * -1000,
            yaw: gamepad.axes[0].toFixed(1) * -1000,
            thrust: ((gamepad.buttons[7].value + 1) / 2).toFixed(2) * 1000
        }

        if (JSON.stringify(values) != JSON.stringify(currentValues)) {
            if (window.pilotMode == "enabled") {
                socket.emit("manual_control_send", values)
            }

            currentValues = values
        }

        //take high res image
        if (gamepad.buttons[10].pressed && !gamepad.buttons[11].pressed) {
            if (!qualityTimeout) {
                window.alert("Taking Picture...", "info", 3000)

                socket.emit("camera_still", {width: 1920, height: 1080})
                enableQualityTimeout()
            }
        }
        
        //set video quality
        if (!qualityTimeout) {
            if (gamepad.buttons[12].pressed) {
                socket.emit("video_bitrate_factorize", 1.2)
                window.alert("Updating Video Quality", "info", 3000)
                enableQualityTimeout()
            }
            if (gamepad.buttons[13].pressed) {
                socket.emit("video_bitrate_factorize", 0.8)
                window.alert("Updating Video Quality", "info", 3000)
                enableQualityTimeout()
            }
        }
    }
}

export default {
    "Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)": (gamepad, socket) => {
        ps4Controller(gamepad, socket)
    },
    "DUALSHOCK 4 Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)": (gamepad, socket) => {
        ps4Controller(gamepad, socket)
    }
}