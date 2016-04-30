# Messing around with Angular 2 Universal Starter and ES2015

A minimal Angular 2 starter for Universal JavaScript using webpack
Goals:
* use Angular2
* use universal/isomorphic JS
* use minimal or no server transpiling (es6 imports are most noticeable loss,
  but also cause the most debugging pain when transpiled)
* use webpack/babel for client transpiling
* jasmine for server, client, and e2e
* eslint enforcing code quality and style

## Notable Branches

* master - a messy hodgepodge of features currently using webpack
* webpack - (stale: beta.9) demonstrates minimal angular2 universal with webpack
* systemjs - (stale: beta.9) demonstrates minimal angular2 universal with systemjs

## Installation

* `npm install`

Warning, first install of preboot will fail. Rerun npm install again.
(this is also why we have a 'typings' dependency even though we don't use typescript).
See https://github.com/angular/universal/pull/380

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
