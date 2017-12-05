'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const through2 = require("through2");
require("mocha");
const chai_1 = require("chai");
const sinon_1 = require("sinon");
const _1 = require("../");
describe('stream-head', () => {
    it('should be possible to have a zero bytes in an empty stream', () => __awaiter(this, void 0, void 0, function* () {
        const dup = through2();
        const sh = _1.default(dup, { bytes: 0 });
        dup.end();
        const { stream, head } = yield sh;
        const buf = stream.read(1);
        chai_1.expect(buf).to.equal(null);
    }));
    it('should be possible to have get one byte in a stream with one byte', () => __awaiter(this, void 0, void 0, function* () {
        const dup = through2();
        const sh = _1.default(dup, { bytes: 1 });
        dup.write(Buffer.from("."));
        dup.end();
        const { stream, head } = yield sh;
        const buf = stream.read(1);
        chai_1.expect(buf.toString()).to.equal(".");
    }));
    it('should be possible to have get one byte in a stream with multiple chunks', () => __awaiter(this, void 0, void 0, function* () {
        const dup = through2();
        const sh = _1.default(dup, { bytes: 1 });
        dup.write(Buffer.from("."));
        dup.write(Buffer.from("."));
        dup.end();
        const { stream, head } = yield sh;
        const buf = stream.read(1);
        chai_1.expect(buf.toString()).to.equal(".");
    }));
    it('should be possible to have get one byte in a stream with two bytes', () => __awaiter(this, void 0, void 0, function* () {
        const dup = through2(); // Passthrough stream
        const sh = _1.default(dup, { bytes: 1 });
        dup.write(Buffer.from(".."));
        dup.end();
        const { stream, head } = yield sh;
        const buf = stream.read(1);
        chai_1.expect(buf.toString()).to.equal(".");
    }));
    it('should be possible to request two bytes from a stream with one bytes', () => __awaiter(this, void 0, void 0, function* () {
        const dup = through2(); // Passthrough stream
        const sh = _1.default(dup, { bytes: 2 });
        dup.write(Buffer.from("."));
        dup.end();
        const { stream, head } = yield sh;
        const buf = stream.read(1);
        chai_1.expect(buf.toString()).to.equal(".");
    }));
    it('should return rejected promise on erroneous streams', () => __awaiter(this, void 0, void 0, function* () {
        const notCalled = sinon_1.spy();
        const called = sinon_1.spy();
        const inStream = "foobar";
        const sh = _1.default(inStream, { bytes: 2 });
        yield sh.then(notCalled, called);
        sinon_1.assert.notCalled(notCalled);
        sinon_1.assert.calledOnce(called);
    }));
});
//# sourceMappingURL=stream-head.js.map