/**
 * This is the browser main entry point to the client side application (never used by nodejs)
 */
'use strict';

// Angular 2
require('angular2-universal/polyfills');
const ng2Universal = require('angular2-universal');
const ng2PlatformBrowserDynamic = require('@angular/platform-browser-dynamic');
const ng2Http = require('@angular/http');
const ng2Router = require('@angular/router');

// Application
const App = require('./app/app');
const routes = require('./routes');

// ng2Core/ng2Universal.enableProdMode(); // TODO: when do we need to enable this?

// on document ready bootstrap Angular 2
document.addEventListener('DOMContentLoaded', function ngApp() {
  ng2PlatformBrowserDynamic.bootstrap(App, [
    ng2Http.HTTP_PROVIDERS,
    ng2Router.provideRouter(routes)
  ])
    .then(ng2Universal.prebootComplete);
});
