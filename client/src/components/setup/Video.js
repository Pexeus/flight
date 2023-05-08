import { useEffect, useState } from "react"
import React from 'react'
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


function Video({ socket }) {
    const [options, setOptions] = useState(false)

    function update() {
        const updated = {}

        for (const opt of Object.keys(options)) {
            updated[opt] = convertToNumber(document.querySelector(`#input_${opt}`).value)
        }

        console.log(updated);

        setOptions(false)
        socket.emit("video_config_set", updated)
    }

    function convertToNumber(str) {
        const num = parseFloat(str);
        return isNaN(num) ? str : num;
    }

    useEffect(() => {
        socket.on("video_config", data => {
            setOptions(data)
        })

        socket.emit("video_config_set", false)
    }, [])

    return (
        <div className="videoSettings">
            {options != false
                ? <FormControl sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
                    {Object.keys(options).map(option => {
                        return <TextField key={option} id={`input_${option}`} type="number" label={option} variant="outlined" defaultValue={options[option]} />
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