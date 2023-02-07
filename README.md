[![npm version][npm-image]][npm-url]
[![downloads][downloads-image]][npm-url]
[![build status][build-image]][build-url]
[![coverage status][coverage-image]][coverage-url]


# stream-head

This package allows for inspecting the first *n* bytes from a stream. A kind of *"POSIX [`head(1)`](http://man7.org/linux/man-pages/man1/head.1.html) for JavaScript"*.

It handles both Node.js streams and Whatwg streams (the Web *Streams API* used in browsers).

This package provides TypeScript types.


## Versions

From v3:
 * This package is a pure ESM, no CommonJS support


# API

The default (and only) exported function takes a readable stream and returns a new readable stream `stream` of the same type as the input stream, together with `head` of type `Uint8Array`. The old stream must not be used anymore, it will be piped to the returned stream. The returned stream will contain everything from the input stream, the first *n* bytes will be **copied** to the returned buffer, not *consumed*. If the stream doesn't contain *n* bytes, `head` will be smaller. If the combined chunks up until *n* are larger than *n*, then `head` will be larger than *n* too (it's not truncated).

If the stream is a [Node.js ReadableStream](https://nodejs.org/api/stream.html#stream_readable_streams) it must not be in object-mode but rather transport Node.js [Buffers](https://nodejs.org/api/buffer.html) (or [typed arrays](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)), and if the stream is a [Whatwg ReadableStream](https://developer.mozilla.org/docs/Web/API/ReadableStream), the chunks in the stream (at least up until *n* bytes) must be [typed arrays](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) (such as e.g. [Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)), [ArrayBuffers](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) or [DataViews](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView).

```ts
import streamHead from 'stream-head'

inputStream; // We get this from somewhere

// Peek the first 64 bytes from the stream.
const { stream, head } = await streamHead( inputStream, { bytes: 64 } );

stream; // The new stream (don't use inputStream anymore!)
head; // A Uint8Array with the first *at least* 64 bytes (or less if the stream was smaller)
```


# For TypeScript

In tsconfig.json, `lib` needs to include `"DOM"` and `types` need to include `"node"` because this package support both *DOM* `ReadableStream` and Node.js' `NodeJS.ReadableStream` type.


[npm-image]: https://img.shields.io/npm/v/stream-head.svg
[npm-url]: https://npmjs.org/package/stream-head
[downloads-image]: https://img.shields.io/npm/dm/stream-head.svg
[build-image]: https://img.shields.io/github/actions/workflow/status/grantila/stream-head/master.yml?branch=master
[build-url]: https://github.com/grantila/stream-head/actions?query=workflow%3AMaster
[coverage-image]: https://coveralls.io/repos/github/grantila/stream-head/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/grantila/stream-head?branch=master
[lgtm-image]: https://img.shields.io/lgtm/grade/javascript/g/grantila/stream-head.svg?logo=lgtm&logoWidth=18
[lgtm-url]: https://lgtm.com/projects/g/grantila/stream-head/context:javascript
