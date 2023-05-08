from mav import Mav
import socketio
import eventlet
import threading
import time
from flask import Flask, send_from_directory, request

from converter import Converter
from pymavlink import mavutil
from video import VideoStream
from terminal import Terminal
from mavhttp import Mavhttp

sio = socketio.Server(cors_allowed_origins="*", ping_timeout=1200)
app = Flask(__name__, static_folder='../client/build/', static_url_path='/')

#serve index.html under /
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

#video upload
@app.route('/upload', methods=['POST'])
def upload_file():
    print("[transfer] uploading...")
    file = request.files['file']
    filename = request.form['filename']
    framerate = int(filename.split('-')[0])
    
    #save .h264 file
    file.save(f'./data/{filename}')
    print("[transfer] upload complete!")

    #convert to mp4
    print("[transfer] converting...")
    outputFile = converter.h2642mp4(f'./data/{filename}', framerate)
    print("[transfer] conversion completed!")

    return filename

@sio.event
def connect(sid, environ):
    print('[io] client: ', environ["HTTP_USER_AGENT"])

#connection watcher
@sio.event
def pilot_heartbeat(sid, environ):
    sio.emit("pilot_heartbeat", environ)

#lte telemetry
@sio.event
def lte_status(sid, environ):
    sio.emit("lte_status", environ)

mav = Mav("0.0.0.0:14550")
videoStream = VideoStream(("0.0.0.0", 2000), sio)

term = Terminal(sio)
mavhttp = Mavhttp(sio, socketio, mav)
converter = Converter()

socketio_app = socketio.WSGIApp(sio, app)
eventlet.wsgi.server(eventlet.listen(('', 5000)), socketio_app, log_output=False)
