'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var peek = require("buffer-peek-stream");
function default_1(readable, opts) {
    return new Promise(function (resolve, reject) {
        peek(readable, opts.bytes, function (err, data, outputStream) {
            if (err)
                reject(err);
            else
                resolve({ head: data, stream: outputStream });
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map