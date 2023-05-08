        
from pymavlink import mavutil
import json

class Mav():
    def __init__(self, host):
        print("[mav] connecting:", host)
        connection = mavutil.mavlink_connection(host, baud=57600)

        connection.wait_heartbeat()
        print("[mav] connection ready:", host)
        
        # scuffed, change to short/long only
        self.con = connection

    def setIntervals(self, messages):
        print(messages)
        for message in messages:
            print(message)
            
            self.con.mav.command_long_send(self.con.target_system, self.con.target_component, mavutil.mavlink.MAV_CMD_SET_MESSAGE_INTERVAL,
            0,
            message["id"],
            message["interval"],
            0,
            0,
            0,
            0,
            0,
            )
        
        return True

    def arm(self):
        print("[mav] arming...")

        self.con.mav.command_long_send(
            self.con.target_system,
            self.con.target_component,
            mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM,
            0,
            1, 0, 0, 0, 0, 0, 0)

        self.con.motors_armed_wait()

        print("[mav] armed")
        

        return True

    def disarm(self):
        print("[mav] disarming...")

        self.con.mav.command_long_send(
            self.con.target_system,
            self.con.target_component,
            mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM,
            0,
            0, 0, 0, 0, 0, 0, 0)

        self.con.motors_disarmed_wait()

        print("[mav] disarmed")

        return True

    def loiterAlt(self, alt):
        self.con.mav.command_long_send(
            self.con.target_system,
            self.con.target_component,
            mavutil.mavlink.MAV_CMD_NAV_CONTINUE_AND_CHANGE_ALT,

            0,0, 0, 0, 0, 0, alt, 0)

    def mode(self, modeLower):
        # Check if mode is available
        mode = modeLower.upper()

        if mode not in self.con.mode_mapping():
            print('Unknown mode : {}'.format(mode))
            print('Try:', list(self.con.mode_mapping().keys()))

        # Get mode ID
        mode_id = self.con.mode_mapping()[mode]

        self.con.mav.set_mode_send(
            self.con.target_system,
            mavutil.mavlink.MAV_MODE_FLAG_CUSTOM_MODE_ENABLED,
            mode_id)

        print("[mav] flight mode set to", mode)

    def set_rc_channel_pwm(self, channel_id, pwm=1500):
        master = self.con

        if channel_id < 1 or channel_id > 18:
            print("Channel does not exist.")
            return

        # Mavlink 2 supports up to 18 channels:
        # https://mavlink.io/en/messages/common.html#RC_CHANNELS_OVERRIDE

        rc_channel_values = [65535 for _ in range(18)]
        rc_channel_values[channel_id - 1] = pwm

        self.con.mav.rc_channels_override_send(
            self.con.target_system,
            self.con.target_component,
        *rc_channel_values)      