# Messing around with Angular 2 Universal Starter and ES2015

A minimal Angular 2 starter for Universal JavaScript using ES2015 and Webpack.
Goals:
* use Angular2
* use universal/isomorphic JS
* use minimal or no server transpiling to simplify debugging and comprehension
* thinking about dumping client transpiling too...

## Installation

* `npm install`

## Serve

* `gulp serve` to build your client app and start a web server

## Caveats

* server JS renders, but the client JS crashes with a 'undefined' Token when
instantiating providers.
* server files are watched via nodemon, but webpack watch isn't set up yet.
* there's no production build

## License

MIT
