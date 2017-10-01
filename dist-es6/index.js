'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const peek = require("buffer-peek-stream");
function default_1(readable, opts) {
    return new Promise((resolve, reject) => {
        peek(readable, opts.bytes, (err, data, outputStream) => {
            if (err)
                reject(err);
            else
                resolve({ head: data, stream: outputStream });
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map