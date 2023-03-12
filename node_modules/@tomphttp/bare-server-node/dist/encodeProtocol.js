"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeProtocol = exports.encodeProtocol = exports.validProtocol = void 0;
const validChars = "!#$%&'*+-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ^_`abcdefghijklmnopqrstuvwxyz|~";
const reserveChar = '%';
function validProtocol(protocol) {
    for (let i = 0; i < protocol.length; i++) {
        const char = protocol[i];
        if (!validChars.includes(char)) {
            return false;
        }
    }
    return true;
}
exports.validProtocol = validProtocol;
function encodeProtocol(protocol) {
    let result = '';
    for (let i = 0; i < protocol.length; i++) {
        const char = protocol[i];
        if (validChars.includes(char) && char !== reserveChar) {
            result += char;
        }
        else {
            const code = char.charCodeAt(0);
            result += reserveChar + code.toString(16).padStart(2, '0');
        }
    }
    return result;
}
exports.encodeProtocol = encodeProtocol;
function decodeProtocol(protocol) {
    let result = '';
    for (let i = 0; i < protocol.length; i++) {
        const char = protocol[i];
        if (char === reserveChar) {
            const code = parseInt(protocol.slice(i + 1, i + 3), 16);
            const decoded = String.fromCharCode(code);
            result += decoded;
            i += 2;
        }
        else {
            result += char;
        }
    }
    return result;
}
exports.decodeProtocol = decodeProtocol;
//# sourceMappingURL=encodeProtocol.js.map