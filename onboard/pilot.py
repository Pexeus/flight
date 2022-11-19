import threading
import time

class Pilot():
    def __init__(self, mav, sio):
        self.sio = sio
        self.mav = mav

        watcherThread = threading.Thread(target=self.connectionWatcher, daemon=True)
        watcherThread.start()


    def connectionWatcher(self):
        lastPing = False

        #on ping from pilot
        @self.sio.event
        def pilot_heartbeat(controllerTimestamp):
            nonlocal lastPing

            if lastPing == False:
                print("[pilot] failsave activated")

            lastPing = time.time()
        
        while True:
            time.sleep(0.1)
            if lastPing != False:
                if (time.time() - lastPing > 1):
                    print("[pilot] engaging failsafe")

                    #change to RTL mode
                    self.mav.mode("RTL")

                    #reset failsafe
                    lastPing = False

