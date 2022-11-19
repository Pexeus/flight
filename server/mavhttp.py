from pymavlink import mavutil
import time
import eventlet

eventlet.monkey_patch()

class Mavhttp():
    def __init__(self, sio, socketio, mav):
        #setup local vars
        self.sio = sio
        self.mav = mav
        self.upstreamMessages = []

        #start upstream thread
        socketio.Server.start_background_task(self=sio, target=self.upstream)

        #setup listeners
        @sio.event
        def request_message_stream(sid, messages):
            #combine
            unfiltered = self.upstreamMessages + messages

            #remove doubles
            self.upstreamMessages = [*set(unfiltered)]

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

    def upstream(self):
        #wait for connection to be ready
        self.mav.con.wait_heartbeat()

        while True:
            try:
                packet = self.mav.con.recv_match(type=self.upstreamMessages).to_dict()
                self.sio.emit(packet["mavpackettype"], packet)
                self.sio.emit("packets", packet["mavpackettype"])
                
            except Exception as e:
                pass
                time.sleep(0.1)

        
