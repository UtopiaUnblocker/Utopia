"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenHeader = exports.mapHeadersFromArray = exports.rawHeaderNames = exports.objectFromRawHeaders = void 0;
function objectFromRawHeaders(raw) {
    const result = {};
    Reflect.setPrototypeOf(result, null);
    for (let i = 0; i < raw.length; i += 2) {
        const [header, value] = raw.slice(i, i + 2);
        if (header in result) {
            if (result[header] instanceof Array) {
                result[header].push(value);
            }
            else {
                result[header] = [result[header], value];
            }
        }
        else {
            result[header] = value;
        }
    }
    return result;
}
exports.objectFromRawHeaders = objectFromRawHeaders;
function rawHeaderNames(raw) {
    const result = [];
    for (let i = 0; i < raw.length; i += 2) {
        if (!result.includes(raw[i]))
            result.push(raw[i]);
    }
    return result;
}
exports.rawHeaderNames = rawHeaderNames;
function mapHeadersFromArray(from, to) {
    for (const header of from) {
        if (header.toLowerCase() in to) {
            const value = to[header.toLowerCase()];
            delete to[header.toLowerCase()];
            to[header] = value;
        }
    }
    return to;
}
exports.mapHeadersFromArray = mapHeadersFromArray;
/**
 * Converts a header into an HTTP-ready comma joined header.
 */
function flattenHeader(value) {
    return Array.isArray(value) ? value.join(', ') : value;
}
exports.flattenHeader = flattenHeader;
//# sourceMappingURL=headerUtil.js.map