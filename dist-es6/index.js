'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const through2 = require("through2");
function default_1(readable, opts) {
    return new Promise((resolve, reject) => {
        const headStream = through2(onChunk, onEnd);
        const outputStream = through2();
        let bytesRead = 0;
        let isComplete = false;
        const chunks = [];
        function complete() {
            if (isComplete)
                return null;
            isComplete = true;
            const head = Buffer.concat(chunks);
            resolve({
                head,
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
            const head = complete();
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