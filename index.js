require("colors");
const cluster = require('cluster');
const isMaster = cluster.isMaster;
const express = require('express');
const moment = require('moment');
const fs = require('fs');

let appDirectory = require('path').dirname(process.pkg ? process.execPath : (require.main ? require.main.filename : process.argv[0]));

let args = {
    logToFile: true,
    path: appDirectory + '/power.log',
    workers: 2,
    master: () => {},
    worker: () => {},
    autoRestart: true,
};

// set text color to italy's flag
let italy = str => {
    let out = '';
    let cur = 0;
    for (let i = 0; i < str.length; i++) {
        let char = str.charAt(i);
        if (char !== ' ')
            switch (cur) {
                case 0:
                    out += char.green;
                    cur++;
                    break;
                case 1:
                    out += char.white;
                    cur++;
                    break;
                case 2:
                    out += char.red;
                    cur = 0;
                    break;
            }
        else
            out += char;
    }
    return out;
};

// set italy's color to string prototype
Object.defineProperty(String.prototype, 'italy', {
    get: function () {
        return italy(this);
    }
});

let logToFile = content => {
    let out = `[${moment().format('YY-MM-DD H:mm:ss:SSS')}] ${content}\n`;
    let output = out.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    const stream = fs.createWriteStream(args.path, {flags: 'a'});
    stream.write(output);
};

const log = text => {
    const output = `${isMaster ? `Master`.cyan : `Worker ${cluster.worker.id}`.cyan}: ${text}`;
    console.log(output);
    if (args.logToFile) logToFile(output);
};

const master = async ({ workers, master, autoRestart }) => {
    master();

    cluster.on('online', (worker) => {
        log(`worker ${worker.id} online`.green)
    });

    cluster.on('exit', (worker, exitCode) => {
        log(`worker ${worker.id} exited with code ${exitCode}`);
        if (autoRestart) {
            log(`starting new worker in place of ${worker.id}`);
            cluster.fork();
        }
    })

    process.on('close', () => {
        log('offline'.red);
        process.exit();
    });

    process.on('SIGINT', () => {
        log('offline'.red);
        process.exit();
    });

    for (let i = 0; i < (workers || 1); i++) cluster.fork();
}

const worker = async ({ port, worker }) => {
    const app = new express();

    app.use((req, res, next) => {
        log(`${req.method} request received at ${req.path}`);
        next();
    });

    worker(app);
};

const isFunction = functionToCheck => {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

const load = (options = {}) => {
    args = {...args, ...options};
    if (!isFunction(args.master)) return console.log("Power error: master must be a function".red);
    if (!isFunction(args.worker)) return console.log("Power error: worker must be a function".red);
    if (typeof args.workers !== "number") return console.log("Power error: workers must be a number".red);
    if (typeof args.logToFile !== "boolean") return console.log("Power error: logToFile must be a boolean".red);
    if (typeof args.path !== "string") return console.log("Power error: path must be a string".red);
    if (isMaster) master(args).then(() => log("online".green));
    else worker(args).then(() => log(`startup complete`.green));
};

module.exports = { load, log, italy };
