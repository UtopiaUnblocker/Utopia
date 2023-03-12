"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headersToObject = void 0;
// List of headers that cannot have multiple values,
// while potentially having a comma in their single value.
const singleValueHeaders = ['user-agent'];
/**
 * Converts a given `Headers` instance into a plain object.
 * Respects headers with multiple values.
 */
function headersToObject(headers) {
    const headersObject = {};
    headers.forEach((value, name) => {
        const isMultiValue = !singleValueHeaders.includes(name.toLowerCase()) && value.includes(',');
        headersObject[name] = isMultiValue
            ? value.split(',').map((s) => s.trim())
            : value;
    });
    return headersObject;
}
exports.headersToObject = headersToObject;
