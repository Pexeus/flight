import React, { useEffect, useState } from 'react'
import Split from "stream-split"
import {Player} from "broadway-player"
import toArray from "arraybuffer-to-buffer"


function VideoPlayer({ socket }) {
    function init() {
        //setup buffer stuff
        const NALSeparator = new Buffer.from([0, 0, 0, 1])
        const NALSplitter = new Split(NALSeparator)

        //save current stream stats
        const stats = {}

        //setup player
        window.player = new Player({ useWorker: true, webgl: 'auto', size: { width: 1280, height: 720 } })
        const playerElement = document.getElementById('display')
        playerElement.appendChild(window.player.canvas)

        //recieve and convert video buffer
        socket.on("video", buffer => {
            NALSplitter.write(toArray(buffer))
        })

        NALSplitter.on("data", buffer => {
            stats.frames += 1
            stats.rate = buffer.length

            window.player.decode(buffer)
        })

        setInterval(() => {
            stats.fps = stats.frames * 10
            stats.frames = 0

            document.querySelector("#displayOverlay").innerHTML = `
                FPS: ${stats.fps} <br>
                Bitrate: ${stats.rate}
            `
        }, 100);
    }

    useEffect(() => {
        init()
    }, [socket])

    return (
        <div id='display' className='display'>
            <p  id="displayOverlay" className='displayOverlay'></p>
        </div>
    )
}

export default VideoPlayer