import React, {useState, useEffect} from 'react'
import Chip from '@mui/material/Chip';
import NavigationIcon from '@mui/icons-material/Navigation';

function TakeControl() {
  const [pilotMode, setPilotMode] = useState(window.pilotMode)

  window.addEventListener("pilotModeUpdate", () => {
    setPilotMode(window.pilotMode)
  })

  return (
    <div>
        {window.pilotMode == "available"
          ? <Chip onClick={window.enablePilotMode} icon={<NavigationIcon></NavigationIcon>} label="Take Control" color='primary'></Chip>
          : window.pilotMode == "enabled"
            ? <Chip onClick={window.disablePilotMode} icon={<NavigationIcon></NavigationIcon>} label="Disable Control" color='primary'></Chip>
            : window.pilotMode == "unavailable"
          ? <Chip icon={<NavigationIcon></NavigationIcon>} label="Unavailable" color='error'></Chip>
          : <p>loading...</p>
        }
    </div>
  )
}

export default TakeControl