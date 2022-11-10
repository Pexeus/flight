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
app = socketio.WSGIApp(sio, static_files={"/": "../client/build/", "/models/cessna": "./files/cessna"})

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
    print(inputs)
    mav.set_rc_channel_pwm(1, to.pmw(inputs["yaw"]))
    mav.set_rc_channel_pwm(3, to.pmw(inputs["thrust"]))
    mav.set_rc_channel_pwm(4, to.pmw(inputs["pitch"]))
    mav.set_rc_channel_pwm(5, to.pmw(inputs["roll"]))

@sio.event
def set_mode_send(sid, mode_id):
    mav.con.mav.set_mode_send(
            mav.con.target_system,
            mavutil.mavlink.MAV_MODE_FLAG_CUSTOM_MODE_ENABLED,
            mode_id
        )

@sio.event
def get_status_armed(sid):
    status = mav.con.motors_armed()

    sio.emit("status_armed", status)

@sio.event
def arm(sid, state):
    mav.con.mav.command_long_send(
            mav.con.target_system,
            mav.con.target_component,
            mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM,
            0,
            state, 0, 0, 0, 0, 0, 0)

@sio.event
def set_message_interval(sid, attributes):
    for attribute in attributes:
        mav.con.mav.command_long_send(
        mav.con.target_system,
        mav.con.target_component,
        mavutil.mavlink.MAV_CMD_SET_MESSAGE_INTERVAL,
        0,
        attribute,
        100,
        0,
        0,
        0,
        0,
        0,
        )

socketio.Server.start_background_task(self=sio, target=upstream.upstream)
eventlet.wsgi.server(eventlet.listen(('', 5000)), app, log_output=False)