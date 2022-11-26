import Chip from '@mui/material/Chip';
import React from 'react'
import { useEffect, useState } from 'react'
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import {getMode} from "../mav"
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import SpeedIcon from '@mui/icons-material/Speed';
import ScheduleIcon from '@mui/icons-material/Schedule';
import HeightIcon from '@mui/icons-material/Height';
import TakeControl from './TakeControl'




function InfoPanel({ socket }) {
    const [battery, setBattery] = useState(false)
    const [heartBeat, setHeartBeat] = useState(false)
    const [latency, setLatency] = useState(false)
    const [speed, setSpeed] = useState(null)
    const [alt, setAlt] = useState(null)



    function init() {
        socket.emit("request_message_stream", ["BATTERY_STATUS", "HEARTBEAT"])


        socket.on("BATTERY_STATUS", p => {
            setBattery(p)
        })

        socket.on("HEARTBEAT", p => {
            setHeartBeat(p)
        })

        socket.on("latency", p => {
            setLatency(p)
        })

        socket.on("VFR_HUD", packet => {
            setSpeed(packet.groundspeed)
            setAlt(packet.alt)
        })
    }

    useEffect(() => {
        init()
    }, [])
    

    return (
        <div className='infoPanel'>
            <div className='line'>
                {heartBeat.custom_mode != undefined
                    ? <Chip variant='outlined' icon={<AirplanemodeActiveIcon/>} label={`${getMode(heartBeat.custom_mode)}`}/>
                    : <Chip variant='outlined' icon={<AirplanemodeActiveIcon/>} label={`loading...`}/>
                }
                {battery.voltages
                    ? <Chip variant='outlined' icon={<BatteryFullIcon/>} label={`${(battery.voltages[0] / 1000).toFixed(2)}V`}/>
                    : <Chip variant='outlined' icon={<BatteryFullIcon/>} label={`loading...`}/>
                }
                {speed != null
                    ? <Chip variant='outlined' icon={<SpeedIcon/>} label={`${speed.toFixed(2)}m/s`}/>
                    : <Chip variant='outlined' icon={<SpeedIcon/>} label={`loading...`}/>
                }
                {alt != null
                    ? <Chip variant='outlined' icon={<HeightIcon/>} label={`${alt.toFixed(2)}m`}/>
                    : <Chip variant='outlined' icon={<HeightIcon/>} label={`loading...`}/>
                }
            </div>
            <div className='line'>
                <TakeControl socket={socket}></TakeControl>
                {latency
                    ? <Chip variant='outlined' icon={<ScheduleIcon/>} label={`${latency}ms`}/>
                    : <Chip variant='outlined' icon={<ScheduleIcon/>} label={`loading...`}/>
                }
            </div>
        </div>
    )
}

export default InfoPanel