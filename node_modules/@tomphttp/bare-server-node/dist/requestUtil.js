"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upgradeFetch = exports.fetch = void 0;
const BareServer_js_1 = require("./BareServer.js");
const node_http_1 = require("node:http");
const node_https_1 = require("node:https");
const httpAgent = new node_http_1.Agent({
    keepAlive: true,
    timeout: 12e3,
});
const httpsAgent = new node_https_1.Agent({
    keepAlive: true,
    timeout: 12e3,
});
function outgoingError(error) {
    if (error instanceof Error) {
        switch (error.code) {
            case 'ENOTFOUND':
                return new BareServer_js_1.BareError(500, {
                    code: 'HOST_NOT_FOUND',
                    id: 'request',
                    message: 'The specified host could not be resolved.',
                });
            case 'ECONNREFUSED':
                return new BareServer_js_1.BareError(500, {
                    code: 'CONNECTION_REFUSED',
                    id: 'response',
                    message: 'The remote rejected the request.',
                });
            case 'ECONNRESET':
                return new BareServer_js_1.BareError(500, {
                    code: 'CONNECTION_RESET',
                    id: 'response',
                    message: 'The request was forcibly closed.',
                });
            case 'ETIMEOUT':
                return new BareServer_js_1.BareError(500, {
                    code: 'CONNECTION_TIMEOUT',
                    id: 'response',
                    message: 'The response timed out.',
                });
        }
    }
    return error;
}
async function fetch(config, request, signal, requestHeaders, url) {
    const options = {
        host: url.host,
        port: url.port,
        path: url.path,
        method: request.method,
        headers: requestHeaders,
        setHost: false,
        localAddress: config.localAddress,
        signal,
    };
    let outgoing;
    if (url.protocol === 'https:')
        outgoing = (0, node_https_1.request)({
            ...options,
            agent: httpsAgent,
        });
    else if (url.protocol === 'http:')
        outgoing = (0, node_http_1.request)({
            ...options,
            agent: httpAgent,
        });
    else {
        throw new RangeError(`Unsupported protocol: '${url.protocol}'`);
    }
    request.body.pipe(outgoing);
    return await new Promise((resolve, reject) => {
        outgoing.on('response', (response) => {
            resolve(response);
        });
        outgoing.on('upgrade', (req, socket) => {
            reject('Remote did not send a response');
            socket.destroy();
        });
        outgoing.on('error', (error) => {
            reject(outgoingError(error));
        });
    });
}
exports.fetch = fetch;
async function upgradeFetch(serverConfig, request, signal, requestHeaders, remote) {
    const options = {
        host: remote.host,
        port: remote.port,
        path: remote.path,
        headers: requestHeaders,
        method: request.method,
        setHost: false,
        localAddress: serverConfig.localAddress,
        signal,
    };
    let outgoing;
    if (remote.protocol === 'wss:') {
        outgoing = (0, node_https_1.request)({ ...options, agent: httpsAgent });
    }
    else if (remote.protocol === 'ws:') {
        outgoing = (0, node_http_1.request)({ ...options, agent: httpAgent });
    }
    else {
        throw new RangeError(`Unsupported protocol: '${remote.protocol}'`);
    }
    outgoing.end();
    return await new Promise((resolve, reject) => {
        outgoing.on('response', (res) => {
            reject('Remote did not upgrade the WebSocket');
            res.destroy();
        });
        outgoing.on('upgrade', (res, socket, head) => {
            resolve([res, socket, head]);
        });
        outgoing.on('error', (error) => {
            reject(outgoingError(error));
        });
    });
}
exports.upgradeFetch = upgradeFetch;
//# sourceMappingURL=requestUtil.js.map