PostgreSQL Cursor
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> Creates a [readable stream](https://nodejs.org/api/stream.html)...


## Installation

``` bash
$ npm install flow-from-pg-cursor
```


## Usage

``` javascript
var stream = require( 'flow-from-pg-cursor' );
```

#### stream( [options] )

Creates a [readable stream](https://nodejs.org/api/stream.html)...

``` javascript

```

The function accepts the following `options`:

*	__highWaterMark__: specifies the `Buffer` level at which `write()` calls start returning `false`. Default: `16` (i.e., 16 queued items).

To set [stream](https://nodejs.org/api/stream.html) `options`,

``` javascript
var opts = {
	'highWaterMark': 64
};

var sStream = stream( from-pg-cursor, opts );
```

__Note__: the returned [stream](https://nodejs.org/api/stream.html) __always__ operates in `objectMode`.


#### stream.factory( options )

Creates a reusable [stream](https://nodejs.org/api/stream.html) factory. The factory method ensures [streams](https://nodejs.org/api/stream.html) are configured identically by using the same set of provided `options`.

``` javascript
var opts = {
	'highWaterMark': 64	
};

var factory = stream.factory( opts );

// Create 10 identically configured streams...
var streams = [];
for ( var i = 0; i < 10; i++ ) {
	streams.push( factory() );
}
```


#### stream.objectMode( [options,] fcn )

This method is a convenience function to create [streams](https://nodejs.org/api/stream.html) which always operate in `objectMode`. The method will __always__ override the `objectMode` option in `options`.

``` javascript
var sStream = stream.objectMode();
```

__Note__: this method behaves the same as the main method and is provided to maintain API consistency with other [`flow`](http://flow-io.com) modules. 


## Examples

``` javascript

```

To run the example code from the top-level application directory,

``` bash
$ DEBUG=* node ./examples/index.js
```

---
## CLI


### Installation

To use the module as a general utility, install the module globally

``` bash
$ npm install -g flow-from-pg-cursor
```


### Usage

``` bash
Usage: flow-from-pg-cursor [options]

Options:

  -h,   --help                 Print this message.
  -V,   --version              Print the package version.
        --sep sep              Separator used to delineate outgoing data.
                               Default: '\n'.
  -hwm, --highwatermark hwm    Specify how much data can be buffered into memory
                               before applying back pressure. Default: 16.
```

The `flow-from-pg-cursor` command is available as a [standard stream](http://en.wikipedia.org/wiki/Pipeline_%28Unix%29).

``` bash
$ flow-from-pg-cursor | <stdin>
``` 


### Examples

``` bash
$ flow-from-pg-cursor
```

For local installations, modify the above command to point to the local installation directory; e.g., 

``` bash
$ ./node_modules/.bin/flow-from-pg-cursor
```

Or, if you have cloned this repository and run `npm install`, modify the command to point to the executable; e.g., 

``` bash
$ node ./bin/cli
```


---
## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```



---
## License

[MIT license](http://opensource.org/licenses/MIT). 


## Copyright

Copyright &copy; 2015. The [Flow.io](https://github.com/flow-io/) Authors.


[npm-image]: http://img.shields.io/npm/v/flow-from-pg-cursor.svg
[npm-url]: https://npmjs.org/package/flow-from-pg-cursor

[travis-image]: http://img.shields.io/travis/flow-io/from-pg-cursor/master.svg
[travis-url]: https://travis-ci.org/flow-io/from-pg-cursor

[codecov-image]: https://img.shields.io/codecov/c/github/flow-io/from-pg-cursor/master.svg
[codecov-url]: https://codecov.io/github/flow-io/from-pg-cursor?branch=master

[dependencies-image]: http://img.shields.io/david/flow-io/from-pg-cursor.svg
[dependencies-url]: https://david-dm.org/flow-io/from-pg-cursor

[dev-dependencies-image]: http://img.shields.io/david/dev/flow-io/from-pg-cursor.svg
[dev-dependencies-url]: https://david-dm.org/dev/flow-io/from-pg-cursor

[github-issues-image]: http://img.shields.io/github/issues/flow-io/from-pg-cursor.svg
[github-issues-url]: https://github.com/flow-io/from-pg-cursor/issues

