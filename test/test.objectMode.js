/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	Stream = require( './../lib/stream.js' ),
	objectMode = require( './../lib/objectMode.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'object mode', function tests() {

	it( 'should export a function', function test() {
		expect( objectMode ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided an options argument which is not an object', function test() {
		var values = [
			'5',
			5,
			true,
			undefined,
			null,
			NaN,
			function(){},
			[]
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				objectMode( value );
			};
		}
	});

	it( 'should return a stream', function test() {
		var tStream = objectMode();
		assert.isTrue( tStream instanceof Stream );
	});

});
