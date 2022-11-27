import requests
import time
import threading
import xml.etree.ElementTree as ET


class Stick():
    def __init__(self, sio):
        self.sio = sio
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0",
            "Accept": "*/*",
            "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
            "_ResponseSource": "Broswer",
            "Update-Cookie": "UpdateCookie",
            "X-Requested-With": "XMLHttpRequest"
        }

        watcherThread = threading.Thread(target=self.watch)
        watcherThread.start()

    def watch(self):
        headers = {
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "_ResponseSource": "Broswer",
            "Update-Cookie": "UpdateCookie",
            "X-Requested-With": "XMLHttpRequest"
        }

        while True:
            try:
                x = requests.get("http://192.168.8.1/api/monitoring/status", headers=self.headers)
                root = ET.fromstring(x.content)
                dataset = {}

                for child in root:
                    dataset[child.tag] = child.text

                self.sio.emit("lte_status", dataset)
            except Exception as e:
                print(e)

            time.sleep(3)