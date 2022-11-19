import subprocess


class Stream():
    def __init__(self, config, sio):
        print("[streamer] initializing")

        self.config = config["video"]
        self.host = config["host_udp"]
        
        self.stream()
        
    def stream(self):
        cmd = f"raspivid -w {self.config['width']}, -h {self.config['height']}  -t 0 -fps {self.config['fps']} -ih -b {self.config['bitrate']} -pf baseline -awbg 1.0,2.5 -ex fixedfps -ev 0 -co 50 -br {self.config['brightness']} -o - | socat - udp-sendto:{self.host},shut-none"

        self.streamer = subprocess.Popen(cmd, shell=True, stdout=subprocess.DEVNULL)

