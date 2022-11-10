import React, {useState, useEffect, useRef} from 'react'
import { Button } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

function Arming({socket}) {
    const [status, setStatus_] = useState()
    const [loading, setLoading] = useState(true)

    const statusRef = React.useRef(status);
    const setStatus = data => {
        statusRef.current = data;
        setStatus_(data);
    };

    function arm() {
        setLoading(true)
        socket.emit("arm", 1)
    }

    function disarm() {
        setLoading(true)
        socket.emit("arm", 0)
    }

    function init() {
        setInterval(() => {
            socket.emit("get_status_armed")
        }, 500);

        socket.on("status_armed", statusUpdate => {
            if (statusUpdate != statusRef.current) {
                console.log(statusUpdate);
                setLoading(false)
                setStatus(statusUpdate)
            }
        })
    }

    function Icon() { 
        if (loading) {
            return <CircularProgress size={20} color="common"></CircularProgress>
        }
        else {
            return <ReportProblemIcon color='common' size={20} />
        }
    }

    
    useEffect(() => {
        init()
    }, [socket])

    return (
        <div className='arming'>
            {status == 0
                ?<Button onClick={arm} color='error' variant="contained" startIcon={<Icon></Icon>}>
                    {!loading ? <>Arm {window.mode}</> : <>Loading...</>}
                </Button>
                :<Button onClick={disarm} color='warning' variant="contained" startIcon={ <Icon></Icon>}>
                    {!loading ? <>Disarm {window.mode}</> : <>Loading...</>}
                </Button>
            }
            {status == 0
            ?<Typography variant="subtitle1" gutterBottom sx={{mt: 1}}>
                The {window.mode} is Currently Disarmed
            </Typography>
            :<Typography variant="subtitle1" gutterBottom sx={{mt: 1}}>
                The {window.mode} is Currently Armed
            </Typography>
            }
        </div>
    )
}

export default Arming