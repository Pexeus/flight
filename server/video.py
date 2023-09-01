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
        def camera_zoom(sid, zoom):
            self.sio.emit("camera_zoom", zoom)

        @self.sio.event
        def camera_still(sid, data):
            self.sio.emit("camera_still", data)

        @self.sio.event
        def video_config_set(sid, data):
            self.sio.emit("video_config_set", data)

        @self.sio.event
        def video_config_current(sid, data):
            print(data)  
            self.sio.emit("video_config_current", data)

        while True:
            data = self.socket.recvfrom(8192)
            self.sio.emit("video", data[0])


