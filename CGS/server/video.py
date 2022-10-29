import socket
import threading

class VideoStream():
    def __init__(self, host, websocket):
        self.socket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
        self.socket.bind(host)
        self.websocket = websocket

        self.reciever = threading.Thread(target=self.proxy)
        self.reciever.start()

    
    def proxy(self):

        while True:
            data = self.socket.recvfrom(8192)
            self.websocket.emit("video", data)


