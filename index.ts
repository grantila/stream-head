'use strict'

import * as through2 from 'through2'


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
		const headStream = through2( onChunk, onEnd );
		const outputStream = through2( );

		let bytesRead = 0;
		let isComplete = false;
		const chunks: Array< Buffer > = [ ];

		function complete( )
		{
			if ( isComplete )
				return null;
			isComplete = true;
			const head = Buffer.concat( chunks );
			resolve( {
				head,
				stream: outputStream,
			} );

			return head;
		}

		function onChunk( chunk, encoding, callback )
		{
			if ( !isComplete )
			{
				chunks.push( chunk );
				bytesRead += chunk.length;

				if ( bytesRead >= opts.bytes )
					this.push( complete( ) );

				return callback( );
			}
			else
			{
				this.push( chunk );
				return callback( );
			}
		}

		function onEnd( callback )
		{
			const head = complete( );
			if ( head )
				this.push( head );
			return callback( );
		}

		headStream.once( 'error', reject );

		readable.pipe( headStream ).pipe( outputStream );
	} );
}
