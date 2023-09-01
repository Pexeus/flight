import Chip from '@mui/material/Chip';
import React from 'react'
import { useEffect, useState } from 'react'
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import {getMode} from "../mav"
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import SpeedIcon from '@mui/icons-material/Speed';
import ScheduleIcon from '@mui/icons-material/Schedule';
import MemoryIcon from '@mui/icons-material/Memory';import HeightIcon from '@mui/icons-material/Height';
import TakeControl from './TakeControl'
import SignalCellular0BarRoundedIcon from '@mui/icons-material/SignalCellular0BarRounded';
import SignalCellular1BarRoundedIcon from '@mui/icons-material/SignalCellular1BarRounded';
import SignalCellular2BarRoundedIcon from '@mui/icons-material/SignalCellular2BarRounded';
import SignalCellular3BarRoundedIcon from '@mui/icons-material/SignalCellular3BarRounded';
import SignalCellular4BarRoundedIcon from '@mui/icons-material/SignalCellular4BarRounded';
import SignalCellularConnectedNoInternet2BarRoundedIcon from '@mui/icons-material/SignalCellularConnectedNoInternet2BarRounded';
import { config } from '../config';
import { getCapacity } from '../battery';




function InfoPanel({ socket }) {
    const [battery, setBattery] = useState(false)
    const [heartBeat, setHeartBeat] = useState(false)
    const [latency, setLatency] = useState(false)
    const [speed, setSpeed] = useState(null)
    const [alt, setAlt] = useState(null)
    const [cpuTemp, setCpuTemp] = useState(null)
    const [stats, setLteStatus] = useState(null)



    function init() {
        socket.emit("request_message_stream", ["BATTERY_STATUS", "HEARTBEAT", "GLOBAL_POSITION_INT"])


        socket.on("BATTERY_STATUS", p => {
            setBattery(p)
        })

        socket.on("HEARTBEAT", p => {
            setHeartBeat(p)
        })

        socket.on("latency", p => {
            setLatency(p)
        })

        socket.on("cpu_temp", p => {
            setCpuTemp(p)
        })

        socket.on("VFR_HUD", packet => {
            setSpeed(packet.groundspeed * 3.6)
        })

        socket.on("GLOBAL_POSITION_INT", packet => {
            const RelativeAltitude = Math.round(packet.relative_alt / 1000);
            setAlt(RelativeAltitude)
        })

        socket.on("lte_status", data => {
            setLteStatus(data)
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
                    : <Chip variant='outlined' icon={<AirplanemodeActiveIcon/>} label={`⚠️`}/>
                }
                {speed != null
                    ? <Chip variant='outlined' icon={<SpeedIcon/>} label={`${speed.toFixed(2)}km/h`}/>
                    : <Chip variant='outlined' icon={<SpeedIcon/>} label={`⚠️`}/>
                }
                {alt != null
                    ? <Chip variant='outlined' icon={<HeightIcon/>} label={`${alt.toFixed(2)}m`}/>
                    : <Chip variant='outlined' icon={<HeightIcon/>} label={`⚠️`}/>
                }
                {stats != null
                    ? <Chip label={'LTE'} variant='outlined' icon={stats
                        ? stats.SignalIcon == "0"|| stats.SignalIcon == "1"
                            ? <SignalCellular0BarRoundedIcon fontSize='small' color='warning'></SignalCellular0BarRoundedIcon>
                            : stats.SignalIcon == "2"
                                ? <SignalCellular1BarRoundedIcon fontSize='small' color='primary'></SignalCellular1BarRoundedIcon>
                                    : stats.SignalIcon == "3"
                                        ? <SignalCellular2BarRoundedIcon fontSize='small' color='primary'></SignalCellular2BarRoundedIcon>
                                        : stats.SignalIcon == "4"
                                            ? <SignalCellular3BarRoundedIcon fontSize='small' color='primary'></SignalCellular3BarRoundedIcon>
                                            : stats.SignalIcon == "5"
                                                ? <SignalCellular4BarRoundedIcon fontSize='small' color='primary'></SignalCellular4BarRoundedIcon>
                                                : <p>{stats.SignalIcon}</p>
                        : <SignalCellularConnectedNoInternet2BarRoundedIcon fontSize='small' color='error'></SignalCellularConnectedNoInternet2BarRoundedIcon>
                    }/>
                    :<Chip variant='outlined' icon={<HeightIcon/>} label={`⚠️`}/>
                }
            </div>
            <div className='line'>
                <TakeControl socket={socket}></TakeControl>
                {latency
                    ? <Chip variant='outlined' icon={<ScheduleIcon/>} label={`${latency}ms`}/>
                    : <Chip variant='outlined' icon={<ScheduleIcon/>} label={`⚠️`}/>
                }
                {battery.voltages
                    ? <Chip variant='outlined' icon={<BatteryFullIcon/>} label={`${(battery.voltages[0] / 1000).toFixed(2)}V | ${getCapacity(config.plane.battery.cells, battery.voltages[0])}%`}/>
                    : <Chip variant='outlined' icon={<BatteryFullIcon/>} label={`⚠️`}/>
                }
                {cpuTemp
                    ? <Chip variant='outlined' icon={<MemoryIcon/>} label={`${Math.round(cpuTemp)} °C`}/>
                    : <Chip variant='outlined' icon={<MemoryIcon/>} label={`⚠️`}/>
                }
            </div>
        </div>
    )
}

export default InfoPanel