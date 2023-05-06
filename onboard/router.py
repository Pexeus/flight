from subprocess import Popen, PIPE
import threading
import time

class Router():
    def __init__(self, config, sio):
        print("[router] initializing")

        self.config = config
        self.sio = sio
        self.ready = False
        self.proxyThread = threading.Thread(target=self.proxy, daemon=True)
        self.proxyThread.start()

        while self.ready == False:
            time.sleep(0.5)
        
        time.sleep(2)

    def proxy(self):
        process = Popen(["mavlink-routerd", "-e", "127.0.0.1:14550", "-e", "192.168.178.31:14550", "-e", f"{self.config['host_mav']}", "/dev/serial0:57600"], stdout=PIPE, stderr=PIPE)    

        # disabled due to possible performance problems
        while True:
            line = process.stderr.readline()

            if len(line) > 0:
                self.ready = True

                print("[mavlink-router] {}".format(line.decode().replace("\n", "")))
                self.sio.emit("router-out", {"output": line.decode()})
