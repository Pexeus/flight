import threading
import time
import eventlet
eventlet.monkey_patch()


class Upstream():
    def __init__(self, connection, socket):
        self.socket = socket
        self.con = connection

        print("[upstream] ready")

    def upstream(self):
        while True:
            packet = self.con.recv_match(blocking=True).to_dict()
            
            self.socket.emit(packet["mavpackettype"], packet)

            # DEBUG OR FEATURE? => check performance impact
            self.socket.emit("*", packet)