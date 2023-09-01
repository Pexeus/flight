import { useEffect, useState } from "react"
import React from 'react'
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Switch } from "@mui/material";
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


function Video({ socket }) {
    const [options, setOptions] = useState(false)

    function update() {
        const updated = {}
        const unsupported = ["profiles"]

        for (const opt of Object.keys(options)) {
            if (unsupported.includes(opt)) {
                updated[opt] = options[opt]

                continue
            }
            
            const input = document.querySelector(`#input_${opt}`)

            if (input.type == "number") {
                updated[opt] = convertToNumber(input.value)
            }
            if (input.type == "checkbox") {
                updated[opt] = input.checked
            }             
        }

        console.log(updated);

        setOptions(false)
        socket.emit("video_config_set", updated)
    }

    function getDescription(key) {
        const customDescriptions = {
            record: "Record video footage"
        }

        if (customDescriptions[key]) {
            return customDescriptions[key]
        }

        return key
    }

    function convertToBoolean(str) {
        if (str == "on") {
            return true
        }
        else {
            return false
        }
    }

    function convertToNumber(str) {
        const num = parseFloat(str);
        return isNaN(num) ? str : num;
    }

    useEffect(() => {
        socket.on("video_config_current", data => {
            setOptions(data)
        })

        socket.emit("video_config_set", false)
    }, [])

    return (
        <div className="videoSettings">
            {options != false
                ? <FormControl sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
                    {Object.keys(options).map(option => {
                        if (typeof(options[option]) == "number") {
                            return <TextField key={option} id={`input_${option}`} type="number" label={getDescription(option)} variant="outlined" defaultValue={options[option]} />
                        }

                        if (typeof(options[option]) == "boolean") {
                            return <FormControlLabel key={option} labelPlacement="start" label={getDescription(option)} control={ <Switch defaultChecked={options[option]}  key={option} id={`input_${option}`}></Switch>}></FormControlLabel>
                        }
                    })}
                    <Button onClick={update} variant="contained">Update</Button>
                </FormControl>
                : <div>
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                        Updating Video Options
                    </Typography>
                </div>
            }
        </div>
    )
}

export default Video