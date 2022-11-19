import React, { useEffect } from 'react'
import { HeadsUpDisplay } from "../hud"

function HUD({socket}) {
    let hud

    function init() {
        const canvas = document.getElementById('hud');
        hud = new HeadsUpDisplay(canvas);

        socket.emit("request_message_stream", ["ATTITUDE", "GLOBAL_POSITION_INT", "VFR_HUD"])

        hud.start();

        socket.on("ATTITUDE", packet => {
            hud.data.pitch = packet.pitch;
            hud.data.roll = packet.roll * -1;
        })

        socket.on("GLOBAL_POSITION_INT", packet => {
            hud.data.altitude = Math.round(packet.relative_alt / 1000);
            const pi = Math.PI;
            const heading = (packet.hdg / 100) * (pi / 180)
            
            hud.data.heading = heading
        })

        socket.on("VFR_HUD", packet => {
            hud.data.throtle = (packet.throttle / 100);
            hud.data.speed = packet.groundspeed
        })
    }

    useEffect(init, [socket])

    return (
        <div className="HUDWrapper">
            <canvas id="hud"></canvas>
        </div>
    )
}

export default HUD