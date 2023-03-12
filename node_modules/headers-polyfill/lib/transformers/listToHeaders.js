"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listToHeaders = void 0;
const Headers_1 = require("../Headers");
function listToHeaders(list) {
    const headers = new Headers_1.default();
    list.forEach(([name, value]) => {
        const values = [].concat(value);
        values.forEach((value) => {
            headers.append(name, value);
        });
    });
    return headers;
}
exports.listToHeaders = listToHeaders;
