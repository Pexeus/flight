const io = require("socket.io-client")
const mavproxy = require("./src/mavproxy")
const streamer = require("./src/streamer")
const socket = io("http://verion.ch")

function init() {
    
    const mav = mavproxy.initiate({
        out1: "udp:192.168.178.31:14550",
        out2: "udp:verion.ch:14550"
    })

    const stream = streamer.init(socket, {
        video: {
            rate: 10000000,
            fps: 30,
            width: 1280,
            height: 720,
            brightness: 80,
        },
        port: 2000,
        host: "verion.ch"
    })
}

init()
