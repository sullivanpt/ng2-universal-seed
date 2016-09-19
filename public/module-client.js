/**
 * This is the browser main ng-module for the client side application (never used by nodejs)
 */
'use strict';

const ng2Core = require('@angular/core');
const ng2Forms = require('@angular/forms');
const ng2Router = require('@angular/router');
const ng2Universal = require('angular2-universal');

// Application
const App = require('./app/app');
const AppComponents = require('./app/app-components');
const routes = require('./routes');

module.exports = ng2Core
  .NgModule({
    bootstrap: [App],
    declarations: [
      App,
      AppComponents.About,
      AppComponents.Home,
      AppComponents.Nested
    ],
    imports: [
      ng2Universal.UniversalModule, // BrowserModule, HttpModule, and JsonpModule are included
      ng2Forms.FormsModule,
      ng2Router.RouterModule.forRoot(routes),
    ],
  })
  .Class({
    constructor: function () { }
  });
