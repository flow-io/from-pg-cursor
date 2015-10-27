'use strict';

// MODULES //

var Stream = require( './stream.js' );


// OBJECT MODE //

/**
* FUNCTION: objectMode( [options] )
*	Creates a stream with `objectMode` set to `true`.
*
* @param {Object} [options] - stream options
* @param {Number} [options.highWaterMark=16] - specifies the Buffer level for when `write()` starts returning `false`
* @returns {Stream} Transform stream
*/
function objectMode( options ) {
	var opts;
	if ( arguments.length ) {
		opts = options;
	} else {
		opts = {};
	}
	opts.objectMode = true;
	return new Stream( opts );
} // end FUNCTION objectMode()


// EXPORTS //

module.exports = objectMode;
