import {socket, connect} from "./socket"
import VideoPlayer from "./components/VideoPlayer";
import StatusBar from "./components/StatusBar";
import { createTheme } from '@mui/material/styles';
import Floaters from "./components/Floaters"

window.mode = "rover"
window.theme = createTheme({
  palette: {
      mode: 'light'
  },
});

function init() {
  connect("http://verion.ch:5000")

  socket.on("event", data => {
    console.log(data);
  })
}

init()

function App() {
  return (
    <div className="app">
      <div className="mainWindow">
        <VideoPlayer socket={socket}/>
      </div>
      <Floaters socket={socket}/>
      <StatusBar socket={socket}/>
    </div>
  );
}

export default App;
