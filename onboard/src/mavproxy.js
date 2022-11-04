const cp = require("child_process")

module.exports = {
    initiate: init
}

function init(args, socket) {
    const command = `mavproxy.py ${parseArgs(args)}`
    const process = cp.spawn(command, [], { shell: true })

    process.stdout.on('data', (data) => {
        console.log("\x1b[2m", `[mavproxy]: ${String(data).replace("\n", "")}`);
    });
      
    process.stderr.on('data', (data) => {
        console.error(`[Error]: ${data}`);
    });
    
    process.on('close', (code) => {
        console.log(`Process ended: ${code}`);
    });

    return process
}

function parseArgs(obj) {
    const args = Object.keys(obj)
    let str = ""

    console.log(obj);

    for (const arg of args) {
        str += ` --${arg.replace(/[0-9]/g, '')}=${obj[arg]}`
    }

    return str
}