"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinHeaders = exports.splitHeaders = void 0;
const BareServer_js_1 = require("./BareServer.js");
const headers_polyfill_1 = require("headers-polyfill");
const MAX_HEADER_VALUE = 3072;
/**
 *
 * Splits headers according to spec
 * @param headers
 * @returns Split headers
 */
function splitHeaders(headers) {
    const output = new headers_polyfill_1.Headers(headers);
    if (headers.has('x-bare-headers')) {
        const value = headers.get('x-bare-headers');
        if (value.length > MAX_HEADER_VALUE) {
            output.delete('x-bare-headers');
            let split = 0;
            for (let i = 0; i < value.length; i += MAX_HEADER_VALUE) {
                const part = value.slice(i, i + MAX_HEADER_VALUE);
                const id = split++;
                output.set(`x-bare-headers-${id}`, `;${part}`);
            }
        }
    }
    return output;
}
exports.splitHeaders = splitHeaders;
/**
 * Joins headers according to spec
 * @param headers
 * @returns Joined headers
 */
function joinHeaders(headers) {
    const output = new headers_polyfill_1.Headers(headers);
    const prefix = 'x-bare-headers';
    if (headers.has(`${prefix}-0`)) {
        const join = [];
        for (const [header, value] of headers) {
            if (!header.startsWith(prefix)) {
                continue;
            }
            if (!value.startsWith(';')) {
                throw new BareServer_js_1.BareError(400, {
                    code: 'INVALID_BARE_HEADER',
                    id: `request.headers.${header}`,
                    message: `Value didn't begin with semi-colon.`,
                });
            }
            const id = parseInt(header.slice(prefix.length + 1));
            join[id] = value.slice(1);
            output.delete(header);
        }
        output.set(prefix, join.join(''));
    }
    return output;
}
exports.joinHeaders = joinHeaders;
//# sourceMappingURL=splitHeaderUtil.js.map