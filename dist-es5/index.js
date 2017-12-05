'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var through2 = require("through2");
function default_1(readable, opts) {
    return new Promise(function (resolve, reject) {
        var headStream = through2(onChunk, onEnd);
        var outputStream = through2();
        var bytesRead = 0;
        var isComplete = false;
        var chunks = [];
        function complete() {
            if (isComplete)
                return null;
            isComplete = true;
            var head = Buffer.concat(chunks);
            resolve({
                head: head,
                stream: outputStream,
            });
            return head;
        }
        function onChunk(chunk, encoding, callback) {
            if (!isComplete) {
                chunks.push(chunk);
                bytesRead += chunk.length;
                if (bytesRead >= opts.bytes)
                    this.push(complete());
                return callback();
            }
            else {
                this.push(chunk);
                return callback();
            }
        }
        function onEnd(callback) {
            var head = complete();
            if (head)
                this.push(head);
            return callback();
        }
        headStream.once('error', reject);
        readable.pipe(headStream).pipe(outputStream);
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map