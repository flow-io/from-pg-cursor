'use strict';

// MODULES //

var isObject = require( 'validate.io-object' ),
	isString = require( 'validate.io-string-primitive' ),
	isArray = require( 'validate.io-array' ),
	isPositiveInteger = require( 'validate.io-positive-integer' ),
	isNonNegative = require( 'validate.io-nonnegative' );


// VALDIATE //

/**
* FUNCTION: validate( opts, options )
*	Validates function options.
*
* @param {Object} opts - destination object
* @param {Object} options - function options
* @param {Array} [options.values] - query values
* @param {Number} [options.nrows] - maximum number of rows to fetch during each query
* @param {Number} [options.interval] - number of milliseconds between queries
* @param {Number} [options.highWaterMark] - specifies the maximum number of bytes (or streamed items) to store in an internal buffer before ceasing to read from an underlying resource
* @returns {Null|Error} null or an error object
*/
function validate( opts, options ) {
	if ( !isObject( options ) ) {
		return new TypeError( 'invalid input argument. Options must be an object. Value: `' + options + '`.' );
	}
	opts.query = options.query;
	if ( !isString( opts.query ) ) {
		return new TypeError( 'invalid option. Query option must be a string primitive. Option: `' + opts.query + '`.' );
	}
	if ( options.hasOwnProperty( 'values' ) ) {
		opts.values = options.values;
		if ( !isArray( opts.values ) ) {
			return new TypeError( 'invalid option. Values option must be an array. Option: `' + opts.values + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'nrows' ) ) {
		opts.nrows = options.nrows;
		if ( !isPositiveInteger( opts.nrows ) ) {
			return new TypeError( 'invalid option. Number of rows option must be a positive integer. Option: `' + opts.nrows + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'interval' ) ) {
		opts.interval = options.interval;
		if ( !isPositiveInteger( opts.interval ) ) {
			return new TypeError( 'invalid option. Interval option must be a positive integer. Option: `' + opts.interval + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'highWaterMark' ) ) {
		opts.highWaterMark = options.highWaterMark;
		if ( !isNonNegative( opts.highWaterMark ) ) {
			return new TypeError( 'invalid option. High watermark option must be a nonnegative number. Option: `' + opts.highWaterMark + '`.' );
		}
	}
	return null;
} // end FUNCTION validate()


// EXPORTS //

module.exports = validate;
