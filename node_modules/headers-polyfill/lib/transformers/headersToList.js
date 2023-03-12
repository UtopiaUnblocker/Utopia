"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headersToList = void 0;
function headersToList(headers) {
    const headersList = [];
    headers.forEach((value, name) => {
        const resolvedValue = value.includes(',')
            ? value.split(',').map((value) => value.trim())
            : value;
        headersList.push([name, resolvedValue]);
    });
    return headersList;
}
exports.headersToList = headersToList;
