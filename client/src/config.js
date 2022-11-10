import events from "./events"

export var config = {
    host: "http://verion.ch:5000",
    mode: "plane",
    theme: "light",
    plane: {
        modes: ["MANUAL", "RTL", "STABILIZE", "TAKEOFF"]
    }
}

export function setConfig(newConfig) {
    config = newConfig

    events.emit("config-update", config)
}
