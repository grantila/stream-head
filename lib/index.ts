import * as through2 from 'through2'


export interface HeadResult< StreamType >
{
	head: Uint8Array;
	stream: StreamType;
}

export interface Options
{
	bytes: number;
}

function isWhatwgStream( stream: NodeJS.ReadableStream | ReadableStream )
: stream is ReadableStream
{
	return typeof ( stream as ReadableStream ).getReader === 'function' &&
		typeof ( stream as ReadableStream ).pipeThrough === 'function';
}

export default function<
	StreamType extends NodeJS.ReadableStream | ReadableStream
>(
	readable: StreamType,
	opts: Options
)
: Promise< HeadResult< StreamType > >
{
	if ( isWhatwgStream( readable ) )
		return streamHeadWhatwg(
			readable as ReadableStream,
			opts.bytes
		) as any;
	else
		return streamHeadNode(
			readable as NodeJS.ReadableStream,
			opts.bytes
		) as any;
}

type TypedArray =
	| Int8Array
	| Uint8Array
	| Uint8ClampedArray
	| Int16Array
	| Uint16Array
	| Int32Array
	| Uint32Array
	| Float32Array
	| Float64Array;

type DataChunk =
	| TypedArray
	| ArrayBuffer
	| SharedArrayBuffer
	| DataView;

function isDataChunk( arr: any ): arr is DataChunk
{
	if (
		arr instanceof Int8Array
		|| arr instanceof Uint8Array
		|| arr instanceof Uint8ClampedArray
		|| arr instanceof Int16Array
		|| arr instanceof Uint16Array
		|| arr instanceof Int32Array
		|| arr instanceof Uint32Array
		|| arr instanceof Float32Array
		|| arr instanceof Float64Array
		|| arr instanceof ArrayBuffer
		|| arr instanceof SharedArrayBuffer
		|| arr instanceof DataView
	)
		return true;

	return false;
}

function ensureTypedArray( chunk: DataChunk ): TypedArray
{
	if ( chunk instanceof DataView )
		return new Uint8Array( chunk.buffer );
	else if (
		chunk instanceof ArrayBuffer || chunk instanceof SharedArrayBuffer
	)
		return new Uint8Array( chunk );
	return chunk;
}

function concat( chunks: Array< DataChunk > ): Uint8Array
{
	const arrays = chunks.map( chunk => ensureTypedArray( chunk ) );
	const len = arrays.reduce( ( prev, arr ) => prev + arr.byteLength, 0 );

	const ret = new Uint8Array( len );
	let offset = 0;
	for ( let arr of arrays )
	{
		ret.set(
			new Uint8Array( arr.buffer, arr.byteOffset, arr.byteLength ),
			offset
		);
		offset += arr.byteLength;
	}

	return ret;
}

function streamHeadWhatwg( readable: ReadableStream, bytes: number )
: Promise< HeadResult< ReadableStream > >
{
	return new Promise< HeadResult< ReadableStream > >(
		( resolve, reject ) =>
	{
		let bytesRead = 0;
		let isComplete = false;
		const chunks: Array< DataChunk > = [ ];

		const reader = readable.getReader( );

		function complete( )
		{
			if ( isComplete )
				return null;
			isComplete = true;
		}

		( async ( ) =>
		{
			while ( true )
			{
				const { done, value: chunk } = await reader.read( );
				if ( done )
				{
					complete( );
					break;
				}
				else
				{
					if ( !isDataChunk( chunk ) )
						throw new TypeError(
							"Expecting chunk to be a typed array"
						);

					bytesRead += chunk.byteLength;
					chunks.push( chunk );
					if ( bytesRead >= bytes )
					{
						complete( );
						break;
					}
				}
			}

			resolve( {
				head: concat( chunks ),
				stream: new ReadableStream< any >( {
					start( ) { },
					async pull( controller )
					{
						if ( chunks.length > 0 )
						{
							chunks.forEach( chunk =>
									controller.enqueue( chunk )
							);
							chunks.length = 0;
							return;
						}
						const { done, value } = await reader.read( );
						if ( done )
							controller.close( );
						else
							controller.enqueue( value );
					}
				} ),
			} );
		} )( )
		.catch( reject );
	} );
}

function streamHeadNode( readable: NodeJS.ReadableStream, bytes: number )
: Promise< HeadResult< NodeJS.ReadableStream > >
{
	return new Promise< HeadResult< NodeJS.ReadableStream > >(
		( resolve, reject ) =>
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
				head: new Uint8Array( head ),
				stream: outputStream,
			} );
			chunks.length = 0;

			return head;
		}

		function onChunk( chunk, encoding, callback )
		{
			if ( !isComplete )
			{
				chunks.push( chunk );
				bytesRead += chunk.length;

				if ( bytesRead >= bytes )
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
