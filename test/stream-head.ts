'use strict'

import * as through2 from 'through2'

import 'mocha'
import { expect } from 'chai'
import { spy, assert } from 'sinon'

import streamHead from '../'


describe( 'stream-head', ( ) =>
{
	it( 'should be possible to have a zero bytes in an empty stream',
		async ( ) =>
	{
		const dup = through2( );

		const sh = streamHead( dup, { bytes: 0 } );

		dup.end( );

		const { stream, head } = await sh;

		const buf = stream.read( 1 );
		expect( buf ).to.equal( null );
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
		expect( buf.toString( ) ).to.equal( "." );
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
		expect( buf.toString( ) ).to.equal( "." );
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
		expect( buf.toString( ) ).to.equal( "." );
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
		expect( buf.toString( ) ).to.equal( "." );
	} );

	it( 'should return rejected promise on erroneous streams',
		async ( ) =>
	{
		const notCalled = spy( );
		const called = spy( );

		const inStream = < NodeJS.ReadableStream >< any >"foobar";

		const sh = streamHead( inStream, { bytes: 2 } );

		await sh.then( notCalled, called );

		assert.notCalled( notCalled );
		assert.calledOnce( called );
	} );
} );
