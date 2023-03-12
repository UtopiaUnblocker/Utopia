"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./sourceMap.js");
const BareServer_js_1 = require("./BareServer.js");
const createServer_js_1 = __importDefault(require("./createServer.js"));
const commander_1 = require("commander");
const dotenv_1 = require("dotenv");
const node_http_1 = require("node:http");
(0, dotenv_1.config)();
const program = new commander_1.Command();
program
    .alias('server')
    .version(BareServer_js_1.pkg.version)
    .option('-d, --directory <directory>', 'Bare directory', '/')
    .option('-h, --host <host>', 'Listening host', process.env.HOST || '0.0.0.0')
    .option('-p, --port <port>', 'Listening port', (val) => {
    const valN = Number(val);
    if (isNaN(valN))
        throw new Error('Bad port');
    return valN;
}, process.env.PORT ? Number(process.env.PORT) : 80)
    .option('-e, --errors', 'Error logging', 'ERRORS' in process.env)
    .option('-la, --local-address <address>', 'Address/network interface', process.env.LOCAL_ADDRESS)
    .option('-m, --maintainer <{email?:string,website?:string}>', 'Bare Server maintainer field')
    .action(({ directory, errors, host, port, localAddress, maintainer, }) => {
    const config = {
        logErrors: errors,
        localAddress,
        maintainer: typeof maintainer === 'string' ? JSON.parse(maintainer) : undefined,
    };
    const bareServer = (0, createServer_js_1.default)(directory, config);
    console.log('Error Logging:', errors);
    console.log('URL:          ', `http://${host === '0.0.0.0' ? 'localhost' : host}${port === 80 ? '' : `:${port}`}${directory}`);
    console.log('Maintainer:   ', config.maintainer);
    const server = (0, node_http_1.createServer)();
    server.on('request', (req, res) => {
        if (bareServer.shouldRoute(req)) {
            bareServer.routeRequest(req, res);
        }
        else {
            res.writeHead(400);
            res.end('Not found.');
        }
    });
    server.on('upgrade', (req, socket, head) => {
        if (bareServer.shouldRoute(req)) {
            bareServer.routeUpgrade(req, socket, head);
        }
        else {
            socket.end();
        }
    });
    server.listen({
        host: host,
        port: port,
    });
});
program.parse(process.argv);
//# sourceMappingURL=cli.js.map