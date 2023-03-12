"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headersToString = void 0;
const headersToList_1 = require("./headersToList");
/**
 * Converts a given `Headers` instance to its string representation.
 */
function headersToString(headers) {
    const list = headersToList_1.headersToList(headers);
    const lines = list.map(([name, value]) => {
        const values = [].concat(value);
        return `${name}: ${values.join(', ')}`;
    });
    return lines.join('\r\n');
}
exports.headersToString = headersToString;
