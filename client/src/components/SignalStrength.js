import React, {useEffect, useState} from 'react'
import Paper from '@mui/material/Paper';
import SignalCellular0BarRoundedIcon from '@mui/icons-material/SignalCellular0BarRounded';
import SignalCellular1BarRoundedIcon from '@mui/icons-material/SignalCellular1BarRounded';
import SignalCellular2BarRoundedIcon from '@mui/icons-material/SignalCellular2BarRounded';
import SignalCellular3BarRoundedIcon from '@mui/icons-material/SignalCellular3BarRounded';
import SignalCellular4BarRoundedIcon from '@mui/icons-material/SignalCellular4BarRounded';
import SignalCellularConnectedNoInternet2BarRoundedIcon from '@mui/icons-material/SignalCellularConnectedNoInternet2BarRounded';

function SignalStrength({ socket }) {
    const [stats, setStats] = useState(false)

    useEffect(() => {
        socket.on("lte_status", data => {
            setStats(data)
        })
    }, [])

    return (
        <div className='signalFloater'>
            {stats
                    ? stats.SignalIcon == "0"|| stats.SignalIcon == "1"
                        ? <SignalCellular0BarRoundedIcon fontSize='large' color='warning'></SignalCellular0BarRoundedIcon>
                        : stats.SignalIcon == "2"
                            ? <SignalCellular1BarRoundedIcon fontSize='large' color='primary'></SignalCellular1BarRoundedIcon>
                                : stats.SignalIcon == "3"
                                    ? <SignalCellular2BarRoundedIcon fontSize='large' color='primary'></SignalCellular2BarRoundedIcon>
                                    : stats.SignalIcon == "4"
                                        ? <SignalCellular3BarRoundedIcon fontSize='large' color='primary'></SignalCellular3BarRoundedIcon>
                                        : stats.SignalIcon == "5"
                                            ? <SignalCellular4BarRoundedIcon fontSize='large' color='primary'></SignalCellular4BarRoundedIcon>
                                            : <p>{stats.SignalIcon}</p>
                    : <SignalCellularConnectedNoInternet2BarRoundedIcon fontSize='large' color='error'></SignalCellularConnectedNoInternet2BarRoundedIcon>
                }
        </div>
    )
}

export default SignalStrength