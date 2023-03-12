"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToHeaders = void 0;
const Headers_1 = require("../Headers");
/**
 * Converts a string representation of headers (i.e. from XMLHttpRequest)
 * to a new `Headers` instance.
 */
function stringToHeaders(str) {
    const lines = str.trim().split(/[\r\n]+/);
    return lines.reduce((headers, line) => {
        if (line.trim() === '') {
            return headers;
        }
        const parts = line.split(': ');
        const name = parts.shift();
        const value = parts.join(': ');
        headers.append(name, value);
        return headers;
    }, new Headers_1.default());
}
exports.stringToHeaders = stringToHeaders;
