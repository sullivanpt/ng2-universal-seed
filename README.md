# Messing around with Angular 2 Universal Starter and ES2015

A minimal Angular 2 starter for Universal JavaScript using webpack
Goals:
* use Angular2
* use universal/isomorphic JS
* use minimal or no server transpiling (es6 imports are most noticeable loss,
  but also cause the most debugging pain when transpiled)
* use webpack/babel for client transpiling

## Notable Branches

* master - a messy hodgepodge of features currently using webpack
* webpack - demonstrates minimal angular2 universal with webpack
* systemjs - demonstrates minimal angular2 universal with systemjs

## Installation

* `npm install`

Notes:
* es6-shim@0.35.0 fixes the Chrome crash but gives a peerDependency warning for angular2 beta 9 and 10.
* angular2 beta 10 doesn't work with angular2-universal yet
* reflect-metadata, zone.js seem to break angular2 if updated to latest
* parse5 seems to break angular2-universal if updated to latest

## Serve

* `gulp serve` to build your client app and start a web server

For fun:
* browse to http://localhost:9000 to see the server rendered app
* browse to http://localhost:9000/about/nested to deep link into server rendered app
* browse to http://localhost:9000/public/index.html to load static html and bypass server rendering
* browse to http://localhost:9000/invalid to verify server returns 404 for unknown resources

## Caveats

* there's no production build
* security implications of server side rendering need to be considered

## License

available under MIT. See LICENSE for more details.
