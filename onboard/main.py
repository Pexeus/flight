import socketio
import json
import time

import terminal
from stream import Stream
from router import Router
from mav import Mav
from pilot import Pilot


def connect(config):
    connected = False

    sio = socketio.Client()
    
    print("[io] connecting to ", config["host_http"])

    @sio.event
    def connect():
        nonlocal connected

        print("[io] connected to", config["host_http"])
        connected = True

    @sio.event
    def disconnect():
        print("[io] disconnected!")

    @sio.event
    def connect_error(data):
        print("[io] connection faillure")

    while connected == False:
        try:
            sio.connect(config["host_http"])
        except Exception as e:
            time.sleep(1)
            #print(e)
    
    return sio
        
def init():
    config = json.load(open("/home/pi/code/GroundControl/onboard/config.json"))

    sio = connect(config)
    router = Router(config, sio)

    mav = Mav("127.0.0.1:14550")

    pilot = Pilot(mav, sio)
    stream = Stream(config, sio)
    terminal.main(sio)


    while True:
        #sio.emit("pty_out",  {"output": "output"})
        sio.sleep(0.1)

init()