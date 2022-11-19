import React, {useState} from 'react'
import {getMode} from "../../mav"
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {config} from "../../config"
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';



function ModeSelection({socket}) {
    const modes = config[window.mode].modes
    const [mode, SetMode] = useState("")

    socket.emit("request_message_stream", ["HEARTBEAT"])

    socket.on("HEARTBEAT", p => {
        const currentMode = getMode(p.custom_mode)
        SetMode(currentMode)
    })

    function updateMode(e) {
        const id = getMode(e.target.value)

        socket.emit("set_mode_send", id)
    }

    return (
        <div className='modeSelection'>
            <FormControl sx={{ minWidth: 200 }}>
                <Select 
                    labelId='modeLabel'
                    value={mode}
                    onChange={updateMode}
                >
                    {modes.map((mode, i) => {
                        return <MenuItem value={mode} key={i}>{mode}</MenuItem>
                    })}
                </Select>
                <FormHelperText>Flight Mode</FormHelperText>
            </FormControl>
        </div>
    )
}

export default ModeSelection