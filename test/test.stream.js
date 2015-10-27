/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	Readable = require( 'readable-stream' ).Readable,
	Stream = require( './../lib/stream.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'Stream', function tests() {

	it( 'should export a function', function test() {
		expect( Stream ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided an invalid option', function test() {
		expect( foo ).to.throw( TypeError );
		function foo() {
			var s = new Stream({
				'highWaterMark': true
			});
		}
	});

	it( 'should return a Readable stream', function test() {
		var s = new Stream();
		assert.instanceOf( s, Readable );
	});

	it( 'should not require the `new` operator', function test() {
		var stream = Stream,
			s;

		s = stream();
		assert.instanceOf( s, Readable );

		s = stream( {} );
		assert.instanceOf( s, Readable );
	});

	it( 'should do something' );

	it( 'should provide a method to destroy a stream', function test( done ) {
		var count = 0,
			s;

		s = new Stream();

		expect( s.destroy ).to.be.a( 'function' );

		s.on( 'error', onError );
		s.on( 'close', onClose );

		s.destroy( new Error() );

		function onError( err ) {
			count += 1;
			if ( err ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
			if ( count === 2 ) {
				done();
			}
		}
		function onClose() {
			count += 1;
			assert.ok( true );
			if ( count === 2 ) {
				done();
			}
		}
	});

	it( 'should not allow a stream to be destroyed more than once', function test( done ) {
		var s;

		s = new Stream();

		s.on( 'error', onError );
		s.on( 'close', onClose );

		// If the stream is closed twice, the test will error...
		s.destroy();
		s.destroy();

		function onClose() {
			assert.ok( true );
			done();
		}
		function onError( err ) {
			console.error( err );
			assert.ok( false );
		}
	});

});
