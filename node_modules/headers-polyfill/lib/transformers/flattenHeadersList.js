"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenHeadersList = void 0;
function flattenHeadersList(list) {
    return list.map(([name, values]) => {
        return [name, [].concat(values).join('; ')];
    });
}
exports.flattenHeadersList = flattenHeadersList;
