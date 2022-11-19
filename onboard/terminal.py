#!/usr/bin/env python3
import argparse
import pty
import os
import subprocess
import select
import termios
import struct
import fcntl
import shlex
import logging
import sys

logging.getLogger("werkzeug").setLevel(logging.ERROR)

def main(socketio):
    config = {}

    config["fd"] = None
    config["child_pid"] = None
    config["cmd"] = "bash"


    def set_winsize(fd, row, col, xpix=0, ypix=0):
        logging.debug("setting window size with termios")
        winsize = struct.pack("HHHH", row, col, xpix, ypix)
        fcntl.ioctl(fd, termios.TIOCSWINSZ, winsize)


    def read_and_forward_pty_output():
        max_read_bytes = 1024 * 20
        while True:
            socketio.sleep(0.01)
            if config["fd"]:
                timeout_sec = 0
                (data_ready, _, _) = select.select([config["fd"]], [], [], timeout_sec)
                if data_ready:
                    output = os.read(config["fd"], max_read_bytes).decode(
                        errors="ignore"
                    )
                    socketio.emit("pty_out", {"output": output})


    @socketio.event
    def pty_in(data):
        if config["fd"]:
            logging.debug("received input from browser: %s" % data)
            os.write(config["fd"], data.encode())


    @socketio.event
    def pty_resize(data):
        if config["fd"]:
            logging.debug(f"Resizing window to {data['rows']}x{data['cols']}")
            set_winsize(config["fd"], data["rows"], data["cols"])


    # create child process attached to a pty we can read from and write to
    (child_pid, fd) = pty.fork()
    
    if child_pid == 0:
        # this is the child process fork.
        # anything printed here will show up in the pty, including the output
        # of this subprocess
        subprocess.run(config["cmd"])
    else:
        # this is the parent process fork.
        # store child fd and pid
        config["fd"] = fd
        config["child_pid"] = child_pid
        set_winsize(fd, 50, 50)
        cmd = " ".join(shlex.quote(c) for c in config["cmd"])
        # logging/print statements must go after this because... I have no idea why
        # but if they come before the background task never starts
        socketio.start_background_task(target=read_and_forward_pty_output)