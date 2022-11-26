let currentValues = false
let qualityTimeout = false

function enableQualityTimeout() {
    qualityTimeout = true
    setTimeout(() => {
        qualityTimeout = false
    }, 500);
} 

export default {
    funcController : () => {
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
    },
    "Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)": (gamepad, socket) => {
        if (gamepad != undefined) {           
            const values = {
                roll: gamepad.axes[2].toFixed(2) * 1000,
                pitch: gamepad.axes[3].toFixed(2) * -1000,
                yaw: gamepad.axes[0].toFixed(2) * -1000,
                thrust: ((gamepad.buttons[7].value + 1) / 2).toFixed(2) * 1000
            }

            if (JSON.stringify(values) != JSON.stringify(currentValues)) {
                if (window.pilotMode == "enabled") {
                    socket.emit("manual_control_send", values)
                }

                currentValues = values
            }

            if (!qualityTimeout) {
                if (gamepad.buttons[12].pressed) {
                    console.log("emit");
                    socket.emit("video_bitrate_factorize", 1.2)
                    enableQualityTimeout()
                }
                if (gamepad.buttons[13].pressed) {
                    socket.emit("video_bitrate_factorize", 0.8)
                    enableQualityTimeout()
                }
            }
        }
    },
    "DUALSHOCK 4 Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 09cc)": (gamepad, socket) => {
        if (gamepad != undefined) {           
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

            if (!qualityTimeout) {
                if (gamepad.buttons[12].pressed) {
                    socket.emit("video_bitrate_factorize", 1.2)
                    enableQualityTimeout()
                }
                if (gamepad.buttons[13].pressed) {
                    socket.emit("video_bitrate_factorize", 0.8)
                    enableQualityTimeout()
                }
            }
        }
    }
}