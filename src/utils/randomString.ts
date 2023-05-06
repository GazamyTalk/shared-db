// https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex

import crypto from "crypto";

export default function randomString(byteLength: number) : string {
    return [...new Uint8Array(crypto.getRandomValues(new Uint8Array(byteLength)))]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}