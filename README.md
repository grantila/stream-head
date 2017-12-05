[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![coverage status][coverage-image]][coverage-url]

# stream-head

This package is a Promise-based alternative to [`buffer-peek-stream`](https://www.npmjs.com/package/buffer-peek-stream), or a *"POSIX [`head(1)`](http://man7.org/linux/man-pages/man1/head.1.html) for Node.js streams"*. It depends only on [`through2`](https://www.npmjs.com/package/through2).

This package provides TypeScript types.

# API

The default (and only) exported function takes a readable stream and returns a new stream (together with a buffer). The old stream must not be used anymore, it will be piped to the returned stream. The returned stream will contain everything from the input stream, the first `n` bytes will be **copied** to the returned buffer, not *consumed*.

```ts
import streamHead from 'stream-head'

inputStream; // We get this from somewhere

// Peek the first 64 bytes from the stream.
const { stream, head } = await streamHead( inputStream, { bytes: 64 } );

stream; // The new stream (don't use inputStream anymore!)
head; // A Buffer with the first 64 bytes (or less if the stream was smaller)
```

[npm-image]: https://img.shields.io/npm/v/stream-head.svg
[npm-url]: https://npmjs.org/package/stream-head
[travis-image]: https://img.shields.io/travis/grantila/stream-head.svg
[travis-url]: https://travis-ci.org/grantila/stream-head
[coverage-image]: https://coveralls.io/repos/github/grantila/stream-head/badge.svg?branch=master
[coverage-url]: https://coveralls.io/github/grantila/stream-head?branch=master
