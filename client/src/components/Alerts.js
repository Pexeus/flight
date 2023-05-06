import React, {useState, useEffect} from 'react'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { padding } from '@mui/system';



function Alerts() {
    const [alerts, setAlerts] = useState([])
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    useEffect(() => {
        window.alert = (message, severity, duration) => {
            setAlerts(cur => [...cur, {message: message, severity: severity, duration: duration}])

            setTimeout(() => {
                setAlerts(cur => {
                    const index = cur.indexOf({message: message, severity: severity, duration: duration})
                    cur.splice(index, 1)
                    
                    return cur
                })

                forceUpdate()
            }, duration);

        }
    }, [])

    return (
        <div className='alerts'>
            <Stack sx={{ width: "100%", maxWidth: '400px', padding: "20px"}} spacing={2}>
                {alerts.map(a => {
                    return <Alert variant="filled" key={Math.random()} severity={a.severity}>{a.message}</Alert>
                })}
            </Stack>
        </div>
    )
}

export default Alerts