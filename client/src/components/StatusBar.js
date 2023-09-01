import React from 'react'
import Gamepad from "./Gamepad"
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import MovieIcon from '@mui/icons-material/Movie';

import { useState, useEffect, useRef } from 'react'

function StatusBar({ socket }) {
    const [video, setVideo] = useState(null)

    socket.on("video_config_current", conf => {
        setVideo(conf)
    })

    return (
        <div className='statusBar' style={{ backgroundColor: window.theme.palette.primary["main"] }}>
            <div className='left'>
                <div onClick={() => { window.toggleSidebar() }} style={{ backgroundColor: window.theme.palette.success["main"] }} className="statusBarButton">
                    <ViewSidebarIcon fontSize='small'></ViewSidebarIcon>
                </div>
                {
                    video != null
                        ? <div className='statusBarInfo'>
                            <MovieIcon fontSize='small'></MovieIcon>
                            <p>{video.width}x{video.height}@{video.fps}fps / {video.bitrate / 1000}kbps</p>
                        </div>
                        : <p></p>
                }
            </div>
            <Gamepad socket={socket} />
        </div>
    )
}

export default StatusBar