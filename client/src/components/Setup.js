import * as React from 'react';
import Arming from './setup/Arming';
import ModeSelection from './setup/ModeSelection';
import Typography from '@mui/material/Typography';



function Setup({socket}) {
    return (
        <div className='setup'>
            <Typography variant="h5" component="div" sx={{ mb: 1 }}>
                Mode Selection
            </Typography>
            <ModeSelection socket={socket}/>
            <Typography variant="h5" component="div" sx={{ mt: 1.5, mb: 1 }}>
                Arming
            </Typography>
            <Arming socket={socket}/>
        </div>
    )
}

export default Setup