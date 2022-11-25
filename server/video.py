import socket
import threading

class VideoStream():
    def __init__(self, host, sio):
        self.socket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
        self.socket.bind(host)
        self.sio = sio

        self.reciever = threading.Thread(target=self.proxy)
        self.reciever.start()

    
    def proxy(self):
        @self.sio.event
        def latency(sid, latency):
            self.sio.emit("latency", latency)

        @self.sio.event
        def video_bitrate_factorize(sid, factor):
            self.sio.emit("video_bitrate_factorize", factor)

        while True:
            data = self.socket.recvfrom(8192)
            self.sio.emit("video", data[0])


