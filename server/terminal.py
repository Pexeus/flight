class Terminal():
    def __init__(self, sio):
        print("[terminal] initiating")

        @sio.event
        def pty_out(sid, data):
            sio.emit("pty_out", data)

        @sio.event
        def pty_in(sid, data):
            sio.emit("pty_in", data)

        @sio.event
        def pty_resize(sid, data):
            sio.emit("pty_resize", data)
