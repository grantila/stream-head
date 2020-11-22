'use strict'

import "web-streams-polyfill/es2018"

import * as through2 from 'through2'

import streamHead from './'

describe( 'Node.js streams', ( ) =>
{
	it( 'should be possible to have a zero bytes in an empty stream',
		async ( ) =>
	{
		const dup = through2( );

		const sh = streamHead( dup, { bytes: 0 } );

		dup.end( );

		const { stream, head } = await sh;

		const buf = stream.read( 1 );
		expect( buf ).toBe( null );
	} );

	it( 'should be possible to have get one byte in a stream with one byte',
		async ( ) =>
	{
		const dup = through2( );

		const sh = streamHead( dup, { bytes: 1 } );

		dup.write( Buffer.from( "." ) );

		dup.end( );

		const { stream, head } = await sh;

		const buf = stream.read( 1 );
		expect( buf.toString( ) ).toBe( "." );
	} );

	it( 'should be possible to have get one byte in a stream with multiple chunks',
		async ( ) =>
	{
		const dup = through2( );

		const sh = streamHead( dup, { bytes: 1 } );

		dup.write( Buffer.from( "." ) );
		dup.write( Buffer.from( "." ) );

		dup.end( );

		const { stream, head } = await sh;

		const buf = stream.read( 1 );
		expect( buf.toString( ) ).toBe( "." );
	} );

	it( 'should be possible to have get one byte in a stream with two bytes',
		async ( ) =>
	{
		const dup = through2( ); // Passthrough stream

		const sh = streamHead( dup, { bytes: 1 } );

		dup.write( Buffer.from( ".." ) );

		dup.end( );

		const { stream, head } = await sh;

		const buf = stream.read( 1 );
		expect( buf.toString( ) ).toBe( "." );
	} );

	it( 'should be possible to request two bytes from a stream with one bytes',
		async ( ) =>
	{
		const dup = through2( ); // Passthrough stream

		const sh = streamHead( dup, { bytes: 2 } );

		dup.write( Buffer.from( "." ) );

		dup.end( );

		const { stream, head } = await sh;

		const buf = stream.read( 1 );
		expect( buf.toString( ) ).toBe( "." );
	} );

	it( 'should return rejected promise on erroneous streams',
		async ( ) =>
	{
		const notCalled = jest.fn( );
		const called = jest.fn( );

		const inStream = < NodeJS.ReadableStream >< any >"foobar";

		const sh = streamHead( inStream, { bytes: 2 } );

		await sh.then( notCalled, called );

		expect( notCalled ).toHaveBeenCalledTimes( 0 );
		expect( called ).toHaveBeenCalledTimes( 1 );
	} );
} );

describe( 'Whatwg streams', ( ) =>
{
	function makeReadableStream( arr: Array< any > ): ReadableStream
	{
		let index = 0;
		return new ReadableStream( {
			start( ) { },
			pull( controller )
			{
				if ( index >= arr.length )
					controller.close( );
				else
					controller.enqueue( arr[ index++ ] );
			}
		} );
	}
	async function consumeReadableStream( stream: ReadableStream )
	: Promise< Array< any > >
	{
		const reader = stream.getReader( );
		const chunks: Array< any > = [ ];
		let chunk: ReadableStreamReadResult<any>;
		while ( chunk = await reader.read( ) )
		{
			if ( chunk.done )
				return chunks;
			chunks.push( chunk.value );
		}
	}

	it( 'should be possible to have a zero bytes in an empty stream',
		async ( ) =>
	{
		const inStream = makeReadableStream( [ ] );

		const { stream, head } = await streamHead( inStream, { bytes: 0 } );

		const bufs = await consumeReadableStream( stream );

		expect( bufs ).toStrictEqual( [ ] );
		expect( head ).toStrictEqual( new Uint8Array( 0 ) );
	} );

	it( 'should be possible to have get one byte in a stream with one byte',
		async ( ) =>
	{
		const inStream = makeReadableStream( [ Buffer.from( "." ) ] );

		const { stream, head } = await streamHead( inStream, { bytes: 1 } );

		const bufs = await consumeReadableStream( stream );

		expect( bufs ).toStrictEqual( [ Buffer.from( "." ) ] );
		expect( head ).toStrictEqual( new Uint8Array( Buffer.from( "." ) ) );
	} );

	it( 'should be possible to have get one byte in a stream with multiple chunks',
		async ( ) =>
	{
		const buffers = [
			Buffer.from( "." ),
			Buffer.from( "." )
		];
		const inStream = makeReadableStream( buffers );

		const { stream, head } = await streamHead( inStream, { bytes: 1 } );

		const bufs = await consumeReadableStream( stream );

		expect( bufs ).toStrictEqual( buffers );
		expect( head ).toStrictEqual( new Uint8Array( Buffer.from( "." ) ) );
	} );

	it( 'should be possible to have get one byte in a stream with two bytes',
		async ( ) =>
	{
		const buffers = [
			Buffer.from( ".." )
		];
		const inStream = makeReadableStream( buffers );

		const { stream, head } = await streamHead( inStream, { bytes: 1 } );

		const bufs = await consumeReadableStream( stream );

		expect( bufs ).toStrictEqual( buffers );
		expect( head ).toStrictEqual( new Uint8Array( Buffer.from( ".." ) ) );
	} );

	it( 'should be possible to request two bytes from a stream with one bytes',
		async ( ) =>
	{
		const buffers = [
			Buffer.from( "." )
		];
		const inStream = makeReadableStream( buffers );

		const { stream, head } = await streamHead( inStream, { bytes: 2 } );

		const bufs = await consumeReadableStream( stream );

		expect( bufs ).toStrictEqual( buffers );
		expect( head ).toStrictEqual( new Uint8Array( Buffer.from( "." ) ) );
	} );

	it( 'should be possible to stream different kinds of typed arrays',
		async ( ) =>
	{
		const buffers = [
			Uint8Array.from( [ 64 ] ).buffer,
			new DataView( Uint8Array.from( [ 65 ] ).buffer ),
			Float64Array.from( [ 3.141592 ] ),
			Float32Array.from( [ 3.141592 ] ),
			Int32Array.from( [ 1234567 ] ),
			Uint32Array.from( [ 4000123 ] ),
			Int16Array.from( [ 32000 ] ),
			Uint16Array.from( [ 65000 ] ),
			Int8Array.from( [ 120 ] ),
			Uint8Array.from( [ 250 ] ),
			Uint8ClampedArray.from( [ 123 ] ),

			// Won't fit into head
			Uint8Array.from( [ 120 ] ),
		];
		const inStream = makeReadableStream( buffers );

		const { stream, head } = await streamHead( inStream, { bytes: 29 } );

		const bufs = await consumeReadableStream( stream );

		expect( bufs ).toStrictEqual( buffers );

		expect( head.byteLength ).toBe( 29 );
		expect( new Uint8Array( head.buffer, 0, 1 ) )
			.toStrictEqual( Uint8Array.from( [ 64 ] ) );
		expect( new Uint8Array( head.buffer, 1, 1 ) )
			.toStrictEqual( Uint8Array.from( [ 65 ] ) );
		expect( new Float64Array( head.buffer.slice( 2, 10 ) ) )
			.toStrictEqual( Float64Array.from( [ 3.141592 ] ) );
		expect( new Float32Array( head.buffer.slice( 10, 14 ) ) )
			.toStrictEqual( Float32Array.from( [ 3.141592 ] ) );
		expect( new Int32Array( head.buffer.slice( 14, 18 ) ) )
			.toStrictEqual( Int32Array.from( [ 1234567 ] ) );
		expect( new Uint32Array( head.buffer.slice( 18, 22 ) ) )
			.toStrictEqual( Uint32Array.from( [ 4000123 ] ) );
		expect( new Int16Array( head.buffer.slice( 22, 24 ) ) )
			.toStrictEqual( Int16Array.from( [ 32000 ] ) );
		expect( new Uint16Array( head.buffer.slice( 24, 26 ) ) )
			.toStrictEqual( Uint16Array.from( [ 65000 ] ) );
		expect( new Int8Array( head.buffer.slice( 26, 27 ) ) )
			.toStrictEqual( Int8Array.from( [ 120 ] ) );
		expect( new Uint8Array( head.buffer.slice( 27, 28 ) ) )
			.toStrictEqual( Uint8Array.from( [ 250 ] ) );
		expect( new Uint8ClampedArray( head.buffer.slice( 28, 29 ) ) )
			.toStrictEqual( Uint8ClampedArray.from( [ 123 ] ) );
	} );

	it.skip( 'should return rejected promise on erroneous streams',
		async ( ) =>
	{
		const notCalled = jest.fn( );
		const called = jest.fn( );

		const inStream = < NodeJS.ReadableStream >< any >"foobar";

		const sh = streamHead( inStream, { bytes: 2 } );

		await sh.then( notCalled, called );

		expect( notCalled ).toHaveBeenCalledTimes( 0 );
		expect( called ).toHaveBeenCalledTimes( 1 );
	} );
} );
