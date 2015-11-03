'use strict';

// MODULES //

var debug = require( 'debug' )( 'from-postgres-cursor:stream' ),
	Readable = require( 'readable-stream' ).Readable,
	copy = require( 'utils-copy' ),
	Cursor = require( 'pg-cursor' ),
	validate = require( './validate.js' );


// VARIABLES //

var DEFAULTS = require( './defaults.json' );


// STREAM //

/**
* FUNCTION: Stream( options )
*	Readable stream constructor.
*
* @constructor
* @param {String} options.query - query string
* @param {Array} [options.values] - query values
* @param {Number} [options.nrows=1000] - maximum number of rows to fetch during each query
* @param {Number} [options.interval=10000] - number of milliseconds between queries
* @param {Number} [options.highWaterMark=1024] - specifies the maximum number of bytes (or streamed items) to store in an internal buffer before ceasing to read from an underlying resource
* @returns {Stream} Readable stream
*/
function Stream( options ) {
	var opts,
		err;

	if ( !arguments.length ) {
		throw new Error( 'insufficient input arguments. Must provide stream options.' );
	}
	if ( !( this instanceof Stream ) ) {
		return new Stream( options );
	}
	opts = copy( DEFAULTS );
	err = validate( opts, options );
	if ( err ) {
		throw err;
	}
	this._opts = opts;

	// The stream always operates in objectMode:
	opts.objectMode = true;

	// The stream encoding must always be `null` (see https://github.com/nodejs/readable-stream/issues/165):
	opts.encoding = null;

	debug( 'Creating a readable stream configured with the following options: %s.', JSON.stringify({
		'objectMode': opts.objectMode,
		'encoding': opts.encoding,
		'highWaterMark': opts.highWaterMark,
		'nrows': opts.nrows,
		'interval': opts.interval
	}));

	// Postgres cursor:
	Cursor.call( this, opts.query, opts.values );

	// Make the stream a Readable stream:
	Readable.call( this, opts );

	// Flag indicating whether a stream has been destroyed:
	this._destroyed = false;

	// Flag indicating if a stream is currently reading:
	this._reading = false;

	// Interval id:
	this._timer = null;

	return this;
} // end FUNCTION Stream()

/**
* Create a prototype which inherits from the parent prototype.
*/
Stream.prototype = Object.create( Readable.prototype );

/**
* Set the constructor.
*/
Stream.prototype.constructor = Stream;

/**
* Copy Cursor prototype to Stream to allow the stream to be a query instance.
*/
(function mixin() {
	var keys,
		key,
		len,
		i;

	keys = Object.keys( Cursor.prototype );
	len = keys.length;
	for ( i = 0; i < len; i++ ) {
		key = keys[ i ];
		if ( key === 'read' ) {
			Stream.prototype._fetch = Cursor.prototype.read;
		} else {
			Stream.prototype[ key ] = Cursor.prototype[ key ];
		}
	}
})();


/**
* METHOD: _read( nbytes )
*	Implements the `_read` method to fetch data from a database.
*
* @param {Number} nbytes - number of bytes to read (advisory)
* @returns {Void}
*/
Stream.prototype._read = function _read() {
	var self = this;
	if ( this._reading || this._destroyed || this._timer ) {
		return;
	}
	debug( 'Polling the database...' );
	poll();
	this._timer = setInterval( poll, this._opts.interval );

	/**
	* FUNCTION: poll()
	*	Polls a database.
	*
	* @private
	* @returns {Void}
	*/
	function poll() {
		debug( 'Attempting to read from the database...' );
		self._reading = true;
		self._fetch( self._opts.nrows, onRead );
	}

	/**
	* FUNCTION: onRead( error, rows )
	*	Callback invoked upon reading from a database.
	*
	* @private
	* @param {Error|Null} error - error object
	* @param {Object[]} rows - database rows
	* @returns {Void}
	*/
	function onRead( error, rows ) {
		var bool,
			len,
			i;
		if ( error ) {
			debug( 'Encountered an error while reading from the database. Error: %s.', error.message );
			return self.emit( 'error', error );
		}
		len = rows.length;
		if ( !len ) {
			debug( 'Finished reading from the database. No more rows are available for the current transaction.' );
			debug( 'Stream will now end...' );
			self.destroy();
			return;
		}
		debug( 'Successfully read from the database.' );
		debug( 'Streaming %d rows...', len );
		for ( i = 0; i < len; i++ ) {
			bool = self.push( rows[ i ] );
		}
		debug( 'Finished streaming %d rows...', len );
		if ( bool === false ) {
			debug( 'Stopping polling until downstream consumer is ready for more data...' );
			clearInterval( self._timer );
			self._timer = null;
		}
	}
}; // end METHOD _read()

/**
* METHOD: destroy( [error] )
*	Gracefully destroys a stream, providing backwards compatibility.
*
* @param {Object} [error] - optional error message
* @returns {Stream} Stream instance
*/
Stream.prototype.destroy = function destroy( error ) {
	var self = this;
	if ( this._destroyed ) {
		debug( 'Attempted to destroy an already destroyed stream.' );
		return this;
	}
	this._destroyed = true;

	// Clear the interval:
	debug( 'Stopping polling...' );
	clearInterval( this._timer );
	this._timer = null;

	// Close the cursor:
	debug( 'Closing database cursor...' );
	Cursor.prototype.close.call( this, onCursor );

	return this;

	/**
	* FUNCTION: onCursor( [err] )
	*	Callback invoked after closing a cursor.
	*
	* @private
	* @param {Error} [err] - error object
	* @returns {Void}
	*/
	function onCursor( err ) {
		if ( err ) {
			debug( 'Encountered an error while closing the database cursor. Unable to destroy stream. Error: %s.', err.message );
			self._destroyed = false;
			return self.emit( 'error', err );
		}
		debug( 'Successfully closed the database cursor.' );
		process.nextTick( close );
	}

	/**
	* FUNCTION: close()
	*	Emits a `close` event.
	*
	* @private
	* @returns {Void}
	*/
	function close() {
		if ( error ) {
			debug( 'Stream was destroyed due to an error. Error: %s.', JSON.stringify( error ) );
			self.emit( 'error', error );
		}
		self.push( null );

		debug( 'Closing the stream...' );
		self.emit( 'close' );
	}
}; // end METHOD destroy()


// EXPORTS //

module.exports = Stream;
