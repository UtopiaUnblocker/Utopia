"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendHeader = void 0;
/**
 * Appends a given header to the headers object.
 * Converts multiple values into a list.
 */
function appendHeader(headers, name, value) {
    if (headers.hasOwnProperty(name)) {
        return Object.assign({}, headers, {
            [name]: [].concat(headers[name]).concat(value),
        });
    }
    return Object.assign({}, headers, {
        [name]: value,
    });
}
exports.appendHeader = appendHeader;
