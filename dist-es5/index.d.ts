/// <reference types="node" />
export interface HeadResult {
    head: Buffer;
    stream: NodeJS.ReadableStream;
}
export interface Options {
    bytes: number;
}
export default function (readable: NodeJS.ReadableStream, opts: Options): Promise<HeadResult>;
