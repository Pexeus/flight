import socketio
import json
import time
import signal
import sys
import os
import threading
import subprocess


import terminal
from stream import Stream
from router import Router
from mav import Mav
from pilot import Pilot
from stick import Stick


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

def signal_handler(sig, frame):
    print("[main] exiting...")

    process = subprocess.Popen("sudo pkill raspivid", shell=True, stdout=subprocess.PIPE)
    process.wait()

    os.system("sudo pkill python")

    sys.exit(0)

def init():
    config = json.load(open("/home/pi/code/GroundControl/onboard/config.json"))
    sio = connect(config)

    stick = Stick(sio)
    stream = Stream(config, sio)
    router = Router(config, sio)
    mav = Mav("127.0.0.1:14550")
    pilot = Pilot(mav, sio)
    terminal.main(sio)
    
    print("startup complete")

    #kysThread = threading.Thread(target=kys)
    #kysThread.start()

    #wait for kill signal
    signal.signal(signal.SIGINT, signal_handler)
    signal.pause()

init()
