/**
 * This is the browser main entry point to the client side application (never used by nodejs)
 */
'use strict';

// Angular 2
require('angular2-universal-polyfills');
// const ng2Core = require('@angular/core');
const ng2Universal = require('angular2-universal');

// ng2Core.enableProdMode(); // TODO: when do we need to enable this?

const ModuleClient = require('./module-client');

const platformRef = ng2Universal.platformUniversalDynamic();

// on document ready bootstrap Angular 2
document.addEventListener('DOMContentLoaded', function ngApp() {
  platformRef
    .bootstrapModule(ModuleClient);
    // .then(ng2Universal.prebootComplete); TODO: do we still need this?
});
