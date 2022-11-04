from mav import Mav
import socketio
import eventlet
import threading
import time

from upstream import Upstream
from converter import Converter
from pymavlink import mavutil
from video import VideoStream


sio = socketio.Server(cors_allowed_origins="*")
app = socketio.WSGIApp(sio, static_files={})

to = Converter()
mav = Mav("0.0.0.0:14550")
upstream = Upstream(mav.con, sio)
videoStream = VideoStream(("0.0.0.0", 2000), sio)

@sio.event
def connect(sid, environ):
    print('[io] Frontend Connected: ', environ["HTTP_USER_AGENT"])

@sio.event
def manual_control_send(sid, inputs):
    try:
        mav.con.mav.manual_control_send(
        mav.con.target_system,
        inputs["pitch"] * 1000,
        inputs["roll"] * 1000,
        inputs["thrust"] * 1000,
        inputs["yaw"] * 1000,
        0)
    except Exception as e:
        print(e)

@sio.event
def rc_channels_override(sid, inputs):
    mav.set_rc_channel_pwm(1, to.pmw(inputs["yaw"]))
    mav.set_rc_channel_pwm(3, to.pmw(inputs["thrust"]))
    mav.set_rc_channel_pwm(4, to.pmw(inputs["pitch"]))
    mav.set_rc_channel_pwm(5, to.pmw(inputs["roll"]) + 50)


socketio.Server.start_background_task(self=sio, target=upstream.upstream)
eventlet.wsgi.server(eventlet.listen(('', 5000)), app, log_output=False)