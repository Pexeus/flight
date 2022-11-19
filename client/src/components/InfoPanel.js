import Chip from '@mui/material/Chip';
import React from 'react'
import { useEffect, useState } from 'react'
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import {getMode} from "../mav"
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';



function InfoPanel({ socket }) {
    const [battery, setBattery] = useState(false)
    const [heartBeat, setHeartBeat] = useState(false)

    function init() {
        socket.emit("request_message_stream", ["BATTERY_STATUS", "HEARTBEAT"])


        socket.on("BATTERY_STATUS", p => {
            setBattery(p)
        })

        socket.on("HEARTBEAT", p => {
            setHeartBeat(p)
        })

    }

    useEffect(() => {
        init()
    })
    

    return (
        <div className='infoPanel'>
            {heartBeat.custom_mode != undefined
                ? <Chip variant='outlined' icon={<AirplanemodeActiveIcon/>} label={`${getMode(heartBeat.custom_mode)}`}/>
                : <Chip variant='outlined' icon={<AirplanemodeActiveIcon/>} label={`loading...`}/>
            }
            {battery.voltages
                ? <Chip variant='outlined' icon={<BatteryFullIcon/>} label={`${(battery.voltages[0] / 1000).toFixed(2)}V`}/>
                : <Chip variant='outlined' icon={<BatteryFullIcon/>} label={`loading...`}/>
            }
        </div>
    )
}

export default InfoPanel