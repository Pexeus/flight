import React, {useState} from 'react'
import {getMode} from "../../mav"
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {config} from "../../config"
import FormControl from '@mui/material/FormControl';



function ModeSelection({socket}) {
    const modes = config[window.mode].modes
    const [mode, SetMode] = useState("")

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
            </FormControl>
        </div>
    )
}

export default ModeSelection