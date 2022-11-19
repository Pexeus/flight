from subprocess import Popen, PIPE
import threading


class Router():
    def __init__(self, config, sio):
        self.config = config
        self.sio = sio
        self.proxyThread = threading.Thread(target=self.proxy, daemon=True)
        self.proxyThread.start()

        print("[router] initializing")

    def proxy(self):
        process = Popen(["mavlink-routerd", "-e", "127.0.0.1:14550", "-e", f"{self.config['host_mav']}", "/dev/serial0:57600"], stdout=PIPE, stderr=PIPE)    

        # disabled due to possible performance problems
        while True:
            line = process.stderr.readline()

            if len(line) > 0:
                #print("[mavlink-router] {}".format(line.decode().replace("\n", "")))
                self.sio.emit("router-out", {"output": line.decode()})