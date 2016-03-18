# Messing around with Angular 2 Universal Starter and ES2015

A minimal Angular 2 starter for Universal JavaScript using ES2015 and Webpack.
Goals:
* use Angular2
* use universal/isomorphic JS
* use minimal or no server transpiling to simplify debugging and comprehension
* thinking about dumping client transpiling too...

## Installation

* `npm install`

You will get a peerDependency warning for es-shim. Be sure you are using 0.35.0.
See https://github.com/angular/angular/issues/7601

## Serve

* `gulp serve` to build your client app and start a web server

## Caveats

* SYSTEMJS (systemjs branch): server and client render, but preboot must be disabled.
* WEBPACK (master branch): server JS renders, but the client JS crashes with a 'undefined' Token when
instantiating providers.
* there's no production build

## License

MIT
