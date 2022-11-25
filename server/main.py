from mav import Mav
import socketio
import eventlet
import threading
import time

from converter import Converter
from pymavlink import mavutil
from video import VideoStream
from terminal import Terminal
from mavhttp import Mavhttp

to = Converter()

sio = socketio.Server(cors_allowed_origins="*", ping_timeout=1200)
app = socketio.WSGIApp(sio, static_files={"/": "../client/build/", "/models/cessna": "./files/cessna"})


@sio.event
def connect(sid, environ):
    print('[io] client: ', environ["HTTP_USER_AGENT"].split()[0])

#connection watcher
@sio.event
def pilot_heartbeat(sid, environ):
    sio.emit("pilot_heartbeat", environ)

mav = Mav("0.0.0.0:14550")
videoStream = VideoStream(("0.0.0.0", 2000), sio)

term = Terminal(sio)

mavhttp = Mavhttp(sio, socketio, mav)

eventlet.wsgi.server(eventlet.listen(('', 5000)), app, log_output=False)