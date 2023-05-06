import subprocess
from ping3 import ping
import threading
import time
import os
import signal


class Stream():
    def __init__(self, config, sio):
        print("[streamer] initializing")
        os.system("sudo pkill raspivid")

        self.sio = sio
        self.config = config["video"]
        self.host = config["host_udp"]
        self.host_ip = config["host_ip"]
        self.baseLatency = self.ping_avg(self.host_ip, 8, 0)
        self.streaming = True
        self.autoBitrate = False
        self.zoom = ""

        streamThread = threading.Thread(target=self.stream)
        streamThread.start()

        restarterThread = threading.Thread(target=self.autorestart)
        restarterThread.start()

        #socket events
        @sio.event
        def video_bitrate_factorize(factor):
            self.factorBitrate(factor)

        @sio.event
        def video_config_set(config):
            if config != False:
                self.config = config

                self.kill()
                time.sleep(2)
                self.start()

            sio.emit("video_config", self.config)

        @sio.event
        def camera_zoom(zoom):
            print(f"--roi {0.5 - (zoom/2)},{0.5 - (zoom/2)}, {zoom}, {zoom}")
            self.kill()
            self.zoom = f"--roi {0.5 - (zoom/2)},{0.5 - (zoom/2)},{zoom},{zoom}"
            self.start()

        @sio.event
        def camera_still(options):
            print(options)
            self.kill()
            o = os.popen(f"raspistill -o ./data/{time.time()}.jpg --nopreview --exposure sports --timeout 1000 {self.zoom}").read()
            self.start()

    
    def start(self):
        cmd = f"raspivid {self.zoom} -n -w {self.config['width']}, -h {self.config['height']}  -t 0 -fps {self.config['fps']} -ih -b {self.config['bitrate']} -pf baseline -rot 180 -awbg 1.0,2.5 -ex fixedfps -ev 0 -co 50 -br {self.config['brightness']} -o - | tee my_video.h264 | socat - udp-sendto:{self.host},shut-none"
        self.streamer = subprocess.Popen(cmd, shell=True, preexec_fn=os.setsid, stderr=subprocess.PIPE)

    def autorestart(self):
        while self.streaming:
            if hasattr(self, "streamer"):
                line = self.streamer.stderr.readline()

                if len(line) > 1:
                    print("[streamer] autorestart")
                    print(line)
                    self.kill()
                    time.sleep(2)
                    self.start()

    def stream(self):
        self.start()

        while self.streaming:
            latency = self.ping_avg(self.host_ip, 8, 0.2)

            #print("[streamer] current latency: {}ms base latency:{}ms".format(self.baseLatency, latency))
            
            try:
                self.sio.emit("latency", latency)
            except:
                print("[streamer] cant send latency update")
            
            #increase
            if self.autoBitrate:
                if (latency < self.baseLatency):
                    #adjust bitrate
                    self.factorBitrate(1.2)

                # reduce
                if latency > self.baseLatency * 2:                
                    #adjust bitrate
                    factor =  self.baseLatency / latency

                    self.factorBitrate(factor)


    def factorBitrate(self, factor):
        self.config["bitrate"] = round(self.config["bitrate"] * factor)
        print("[bitrate update]", "factor:", factor,  "bitrate:", self.config["bitrate"])

        #kill current streamer
        self.kill()

        #startup new process
        self.start()


    def kill(self):
        os.killpg(os.getpgid(self.streamer.pid), signal.SIGTERM)
        os.system("sudo pkill raspivid")

        #self.baseLatency = self.ping_avg(self.host_ip, 8, 0.2)

    def ping_avg(self, host, numPings, spread):
        pings = []

        while len(pings) <= numPings:
            time.sleep(spread)
            try:
                ms = round(ping(host) * 1000)
                #print("{}: {}ms".format(host, ms))
                pings.append(ms)
            except Exception as e:
                #trash
                #print(e)
                pings.append(1000)
        
        return round(sum(pings) / len(pings))
