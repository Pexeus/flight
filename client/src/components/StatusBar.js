import React from 'react'
import Gamepad from "./Gamepad"
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import MovieIcon from '@mui/icons-material/Movie';
import NearMeIcon from '@mui/icons-material/NearMe';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';

function StatusBar({ socket }) {
    return (
        <div className='statusBar' style={{ backgroundColor: window.theme.palette.primary["main"] }}>
            <div className='left'>
                <div onClick={() => { window.toggleSidebar() }} style={{ backgroundColor: window.theme.palette.success["main"] }} className="statusBarButton">
                    <ViewSidebarIcon fontSize='small'></ViewSidebarIcon>
                </div>
                <div className='statusBarButton'>
                    <ControlCameraIcon fontSize='small'></ControlCameraIcon>
                </div>
                <div className='statusBarButton'>
                    <NearMeIcon fontSize='small'></NearMeIcon>
                </div>
                <div className='statusBarButton'>
                    <MovieIcon fontSize='small'></MovieIcon>
                </div>
            </div>
            <Gamepad socket={socket} />
        </div>
    )
}

export default StatusBar