'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var through2 = require("through2");
require("mocha");
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var _1 = require("../");
describe('stream-head', function () {
    it('should be possible to have a zero bytes in an empty stream', function () { return __awaiter(_this, void 0, void 0, function () {
        var dup, sh, _a, stream, head, buf;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    dup = through2();
                    sh = _1.default(dup, { bytes: 0 });
                    dup.end();
                    return [4 /*yield*/, sh];
                case 1:
                    _a = _b.sent(), stream = _a.stream, head = _a.head;
                    buf = stream.read(1);
                    chai_1.expect(buf).to.equal(null);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should be possible to have get one byte in a stream with one byte', function () { return __awaiter(_this, void 0, void 0, function () {
        var dup, sh, _a, stream, head, buf;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    dup = through2();
                    sh = _1.default(dup, { bytes: 1 });
                    dup.write(Buffer.from("."));
                    dup.end();
                    return [4 /*yield*/, sh];
                case 1:
                    _a = _b.sent(), stream = _a.stream, head = _a.head;
                    buf = stream.read(1);
                    chai_1.expect(buf.toString()).to.equal(".");
                    return [2 /*return*/];
            }
        });
    }); });
    it('should be possible to have get one byte in a stream with multiple chunks', function () { return __awaiter(_this, void 0, void 0, function () {
        var dup, sh, _a, stream, head, buf;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    dup = through2();
                    sh = _1.default(dup, { bytes: 1 });
                    dup.write(Buffer.from("."));
                    dup.write(Buffer.from("."));
                    dup.end();
                    return [4 /*yield*/, sh];
                case 1:
                    _a = _b.sent(), stream = _a.stream, head = _a.head;
                    buf = stream.read(1);
                    chai_1.expect(buf.toString()).to.equal(".");
                    return [2 /*return*/];
            }
        });
    }); });
    it('should be possible to have get one byte in a stream with two bytes', function () { return __awaiter(_this, void 0, void 0, function () {
        var dup, sh, _a, stream, head, buf;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    dup = through2();
                    sh = _1.default(dup, { bytes: 1 });
                    dup.write(Buffer.from(".."));
                    dup.end();
                    return [4 /*yield*/, sh];
                case 1:
                    _a = _b.sent(), stream = _a.stream, head = _a.head;
                    buf = stream.read(1);
                    chai_1.expect(buf.toString()).to.equal(".");
                    return [2 /*return*/];
            }
        });
    }); });
    it('should be possible to request two bytes from a stream with one bytes', function () { return __awaiter(_this, void 0, void 0, function () {
        var dup, sh, _a, stream, head, buf;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    dup = through2();
                    sh = _1.default(dup, { bytes: 2 });
                    dup.write(Buffer.from("."));
                    dup.end();
                    return [4 /*yield*/, sh];
                case 1:
                    _a = _b.sent(), stream = _a.stream, head = _a.head;
                    buf = stream.read(1);
                    chai_1.expect(buf.toString()).to.equal(".");
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return rejected promise on erroneous streams', function () { return __awaiter(_this, void 0, void 0, function () {
        var notCalled, called, inStream, sh;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notCalled = sinon_1.spy();
                    called = sinon_1.spy();
                    inStream = "foobar";
                    sh = _1.default(inStream, { bytes: 2 });
                    return [4 /*yield*/, sh.then(notCalled, called)];
                case 1:
                    _a.sent();
                    sinon_1.assert.notCalled(notCalled);
                    sinon_1.assert.calledOnce(called);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=stream-head.js.map