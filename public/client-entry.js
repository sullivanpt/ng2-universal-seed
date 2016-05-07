/**
 * This is the browser main entry point to the client side application (never used by nodejs)
 */
'use strict';

// Angular 2
require('angular2-universal/polyfills');
const ng2Universal = require('angular2-universal');

// Application
const AppComponent = require('./app/app');

// ng2Universal.enableProdMode(); // TODO: when do we need to enable this?

ng2Universal.bootstrap(AppComponent, [
  ...ng2Universal.BROWSER_ROUTER_PROVIDERS,
  ...ng2Universal.BROWSER_HTTP_PROVIDERS,
]); // embedded call to prebootComplete happens here
