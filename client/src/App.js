import {socket, connect} from "./socket"
import VideoPlayer from "./components/VideoPlayer";
import StatusBar from "./components/StatusBar";
import { createTheme } from '@mui/material/styles';
import Sidebar from "./components/Sidebar";
import HUD from "./components/HUD"
import Floater from "./components/Floater";
import SignalStrength from "./components/SignalStrength";

import {config} from "./config"

function init() {
  //connect to server
  connect(config.host)

  //create event
  const event = new Event('pilotModeUpdate');

  //setup window scope vars
  window.mode = config.mode
  window.pilotMode = "checking"
  window.setPilotMode = mode => {
    window.pilotMode = mode
    
    window.dispatchEvent(event)
  }
  window.theme = createTheme({
    palette: {
        mode: config.theme
    },
  });

  //check if there are any other pilots connected
  socket.on("pilot_heartbeat", data => {
    if (window.pilotMode != "enabled") {
      window.setPilotMode("unavailable")
    }
  })

  //if not, make pilot mode available
  setTimeout(() => {
    if (window.pilotMode == "checking") {
      window.setPilotMode("available")
    }
  }, 2000);

  //enable pilot mode
  window.enablePilotMode = () => {
    if (window.pilotMode == "available") {
      window.setPilotMode("enabled")
      window.pilotHeartbeat = setInterval(() => {socket.emit("pilot_heartbeat", Date.now())}, 500)

      return true
    }
    else {
      return false
    }
  }

  window.disablePilotMode = () => {
    setPilotMode("available")
    clearInterval(window.pilotHeartbeat)
  }

  setTimeout(() => {
    window.enablePilotMode()
  }, 1000);
}

init()

function App() {
  return (
    <div className="app">
      <div className="mainWindow">
        <VideoPlayer socket={socket}></VideoPlayer>
        <HUD socket={socket}></HUD>
        <Floater socket={socket}></Floater>
        <SignalStrength socket={socket}></SignalStrength>
        <Sidebar socket={socket}/>
      </div>
      <StatusBar socket={socket}/>
    </div>
  );
}

export default App;
