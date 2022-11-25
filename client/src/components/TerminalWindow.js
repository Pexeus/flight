import React, {useEffect} from 'react'
import { FitAddon } from 'xterm-addon-fit';
import { Terminal } from 'xterm';
import { MaterialDark } from 'xterm-theme';




function TerminalWindow({socket, open}) {
    let term
    const fit = new FitAddon();

    function init() {
        term = new Terminal({
            macOptionIsMeta: true,
            scrollback: true,
            theme: MaterialDark
        });
    
        term.loadAddon(fit);
        term.open(document.getElementById("terminal"));
    
        fit.fit()
    
        socket.on("pty_out", data => {
            term.write(data.output)
        })
    
        term.onData(data => {
            console.log(data);
            socket.emit("pty_in", data)
        })
    
        setTimeout(() => {
            resize()
        }, 100);
    
        window.onresize = resize
    }

    function resize() {
        fit.fit();
        const dims = { cols: term.cols, rows: term.rows };
        socket.emit("pty_resize", dims);
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <div className={`terminalContainer ${open}`} onMouseEnter={resize}>
            <div id='terminal'></div>
        </div>
    )
}

export default TerminalWindow