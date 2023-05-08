"use strict";
// https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
function randomString(byteLength) {
    return [...new Uint8Array(crypto_1.default.getRandomValues(new Uint8Array(byteLength)))]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}
exports.default = randomString;
