import {socket, connect} from "./socket"
import VideoPlayer from "./components/VideoPlayer";
import StatusBar from "./components/StatusBar";
import { createTheme } from '@mui/material/styles';
import Floaters from "./components/Floaters"
import Sidebar from "./components/Sidebar";
import HUD from "./components/HUD"
import Map3d from "./components/Map3d";

import {config} from "./config"

window.mode = config.mode
window.theme = createTheme({
  palette: {
      mode: config.theme
  },
});

function init() {
  connect(config.host)
}

init()

function App() {
  return (
    <div className="app">
      <div className="mainWindow">
        <Map3d socket={socket}></Map3d>
        <HUD socket={socket}></HUD>
        <Sidebar socket={socket}/>
      </div>
      <StatusBar socket={socket}/>
    </div>
  );
}

export default App;
