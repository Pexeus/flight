import { io } from "socket.io-client"

export var socket = false

export function connect(url) {
    socket = io(url)

    socket.on("connect", () => {
        console.log("socketio connected to", url);
    })
}