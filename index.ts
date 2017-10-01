'use strict'

import * as peek from 'buffer-peek-stream'


export interface HeadResult
{
	head: Buffer;
	stream: NodeJS.ReadableStream;
}

export interface Options
{
	bytes: number;
}

export default function(
	readable: NodeJS.ReadableStream,
	opts: Options
)
: Promise< HeadResult >
{
	return new Promise< HeadResult >( ( resolve, reject ) =>
	{
		peek( readable, opts.bytes, ( err, data, outputStream ) =>
		{
			if ( err )
				reject( err );
			else
				resolve( { head: data, stream: outputStream } );
		} );
	} );
}
