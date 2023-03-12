"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractMessage_js_1 = require("./AbstractMessage.js");
const BareServer_js_1 = require("./BareServer.js");
const encodeProtocol_js_1 = require("./encodeProtocol.js");
const headerUtil_js_1 = require("./headerUtil.js");
const requestUtil_js_1 = require("./requestUtil.js");
const headers_polyfill_1 = require("headers-polyfill");
const node_crypto_1 = require("node:crypto");
const node_util_1 = require("node:util");
const validProtocols = ['http:', 'https:', 'ws:', 'wss:'];
const randomBytesAsync = (0, node_util_1.promisify)(node_crypto_1.randomBytes);
function loadForwardedHeaders(forward, target, request) {
    for (const header of forward) {
        if (request.headers.has(header)) {
            target[header] = request.headers.get(header);
        }
    }
}
function readHeaders(request) {
    const remote = {};
    const headers = {};
    Reflect.setPrototypeOf(headers, null);
    for (const remoteProp of ['host', 'port', 'protocol', 'path']) {
        const header = `x-bare-${remoteProp}`;
        if (request.headers.has(header)) {
            const value = request.headers.get(header);
            switch (remoteProp) {
                case 'port':
                    if (isNaN(parseInt(value))) {
                        throw new BareServer_js_1.BareError(400, {
                            code: 'INVALID_BARE_HEADER',
                            id: `request.headers.${header}`,
                            message: `Header was not a valid integer.`,
                        });
                    }
                    break;
                case 'protocol':
                    if (!validProtocols.includes(value)) {
                        throw new BareServer_js_1.BareError(400, {
                            code: 'INVALID_BARE_HEADER',
                            id: `request.headers.${header}`,
                            message: `Header was invalid`,
                        });
                    }
                    break;
            }
            remote[remoteProp] = value;
        }
        else {
            throw new BareServer_js_1.BareError(400, {
                code: 'MISSING_BARE_HEADER',
                id: `request.headers.${header}`,
                message: `Header was not specified.`,
            });
        }
    }
    if (request.headers.has('x-bare-headers')) {
        try {
            const json = JSON.parse(request.headers.get('x-bare-headers'));
            for (const header in json) {
                if (typeof json[header] !== 'string' && !Array.isArray(json[header])) {
                    throw new BareServer_js_1.BareError(400, {
                        code: 'INVALID_BARE_HEADER',
                        id: `bare.headers.${header}`,
                        message: `Header was not a String or Array.`,
                    });
                }
            }
            Object.assign(headers, json);
        }
        catch (error) {
            if (error instanceof SyntaxError) {
                throw new BareServer_js_1.BareError(400, {
                    code: 'INVALID_BARE_HEADER',
                    id: `request.headers.x-bare-headers`,
                    message: `Header contained invalid JSON. (${error.message})`,
                });
            }
            else {
                throw error;
            }
        }
    }
    else {
        throw new BareServer_js_1.BareError(400, {
            code: 'MISSING_BARE_HEADER',
            id: `request.headers.x-bare-headers`,
            message: `Header was not specified.`,
        });
    }
    if (request.headers.has('x-bare-forward-headers')) {
        let json;
        try {
            json = JSON.parse(request.headers.get('x-bare-forward-headers'));
        }
        catch (error) {
            throw new BareServer_js_1.BareError(400, {
                code: 'INVALID_BARE_HEADER',
                id: `request.headers.x-bare-forward-headers`,
                message: `Header contained invalid JSON. (${error instanceof Error ? error.message : error})`,
            });
        }
        loadForwardedHeaders(json, headers, request);
    }
    else {
        throw new BareServer_js_1.BareError(400, {
            code: 'MISSING_BARE_HEADER',
            id: `request.headers.x-bare-forward-headers`,
            message: `Header was not specified.`,
        });
    }
    return { remote: remote, headers };
}
async function tunnelRequest(serverConfig, request, res) {
    const abort = new AbortController();
    request.body.on('close', () => {
        if (!request.body.complete)
            abort.abort();
    });
    res.on('close', () => {
        abort.abort();
    });
    const { remote, headers } = readHeaders(request);
    const response = await (0, requestUtil_js_1.fetch)(serverConfig, request, abort.signal, headers, remote);
    const responseHeaders = new headers_polyfill_1.Headers();
    for (const header in response.headers) {
        if (header === 'content-encoding' || header === 'x-content-encoding')
            responseHeaders.set('content-encoding', (0, headerUtil_js_1.flattenHeader)(response.headers[header]));
        else if (header === 'content-length')
            responseHeaders.set('content-length', (0, headerUtil_js_1.flattenHeader)(response.headers[header]));
    }
    responseHeaders.set('x-bare-headers', JSON.stringify((0, headerUtil_js_1.mapHeadersFromArray)((0, headerUtil_js_1.rawHeaderNames)(response.rawHeaders), {
        ...response.headers,
    })));
    responseHeaders.set('x-bare-status', response.statusCode.toString());
    responseHeaders.set('x-bare-status-text', response.statusMessage);
    return new AbstractMessage_js_1.Response(response, { status: 200, headers: responseHeaders });
}
const tempMeta = new Map();
const metaExpiration = 30e3;
async function wsMeta(serverConfig, request) {
    if (request.method === 'OPTIONS') {
        return new AbstractMessage_js_1.Response(undefined, { status: 200 });
    }
    if (!request.headers.has('x-bare-id')) {
        throw new BareServer_js_1.BareError(400, {
            code: 'MISSING_BARE_HEADER',
            id: 'request.headers.x-bare-id',
            message: 'Header was not specified',
        });
    }
    const id = request.headers.get('x-bare-id');
    if (!tempMeta.has(id)) {
        throw new BareServer_js_1.BareError(400, {
            code: 'INVALID_BARE_HEADER',
            id: 'request.headers.x-bare-id',
            message: 'Unregistered ID',
        });
    }
    const meta = tempMeta.get(id);
    tempMeta.delete(id);
    return (0, BareServer_js_1.json)(200, {
        headers: meta.response?.headers,
    });
}
async function wsNewMeta() {
    const id = (await randomBytesAsync(32)).toString('hex');
    tempMeta.set(id, {
        set: Date.now(),
    });
    return new AbstractMessage_js_1.Response(Buffer.from(id));
}
async function tunnelSocket(serverConfig, request, socket) {
    const abort = new AbortController();
    request.body.on('close', () => {
        if (!request.body.complete)
            abort.abort();
    });
    socket.on('close', () => {
        abort.abort();
    });
    if (!request.headers.has('sec-websocket-protocol')) {
        socket.end();
        return;
    }
    const [firstProtocol, data] = request.headers
        .get('sec-websocket-protocol')
        .split(/,\s*/g);
    if (firstProtocol !== 'bare') {
        socket.end();
        return;
    }
    const { remote, headers, forward_headers: forwardHeaders, id, } = JSON.parse((0, encodeProtocol_js_1.decodeProtocol)(data));
    loadForwardedHeaders(forwardHeaders, headers, request);
    const [remoteResponse, remoteSocket] = await (0, requestUtil_js_1.upgradeFetch)(serverConfig, request, abort.signal, headers, remote);
    remoteSocket.on('close', () => {
        // console.log('Remote closed');
        socket.end();
    });
    socket.on('close', () => {
        // console.log('Serving closed');
        remoteSocket.end();
    });
    remoteSocket.on('error', (error) => {
        if (serverConfig.logErrors) {
            console.error('Remote socket error:', error);
        }
        socket.end();
    });
    socket.on('error', (error) => {
        if (serverConfig.logErrors) {
            console.error('Serving socket error:', error);
        }
        remoteSocket.end();
    });
    if (tempMeta.has(id)) {
        tempMeta.get(id).response = {
            headers: (0, headerUtil_js_1.mapHeadersFromArray)((0, headerUtil_js_1.rawHeaderNames)(remoteResponse.rawHeaders), {
                ...remoteResponse.headers,
            }),
        };
    }
    const responseHeaders = [
        `HTTP/1.1 101 Switching Protocols`,
        `Upgrade: websocket`,
        `Connection: Upgrade`,
        `Sec-WebSocket-Protocol: bare`,
        `Sec-WebSocket-Accept: ${remoteResponse.headers['sec-websocket-accept']}`,
    ];
    if ('sec-websocket-extensions' in remoteResponse.headers) {
        responseHeaders.push(`Sec-WebSocket-Extensions: ${remoteResponse.headers['sec-websocket-extensions']}`);
    }
    socket.write(responseHeaders.concat('', '').join('\r\n'));
    remoteSocket.pipe(socket);
    socket.pipe(remoteSocket);
}
function registerV1(server) {
    server.routes.set('/v1/', tunnelRequest);
    server.routes.set('/v1/ws-new-meta', wsNewMeta);
    server.routes.set('/v1/ws-meta', wsMeta);
    server.socketRoutes.set('/v1/', tunnelSocket);
    const interval = setInterval(() => {
        for (const [id, meta] of tempMeta) {
            const expires = meta.set + metaExpiration;
            if (expires < Date.now()) {
                tempMeta.delete(id);
            }
        }
    }, 1e3);
    server.once('close', () => {
        clearInterval(interval);
    });
}
exports.default = registerV1;
//# sourceMappingURL=V1.js.map