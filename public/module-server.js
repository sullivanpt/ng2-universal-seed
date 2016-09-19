/**
 * This is the server main ng-module for the client side application (never used by browser)
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

const ServerOnlyApp = require('./server-only-app/server-only-app');
// TODO: for better SEO. import {Title} from './server-only-app/server-only-app';

module.exports = ng2Core
  .NgModule({
    bootstrap: [App, ServerOnlyApp],
    declarations: [
      ServerOnlyApp, // server side only component
      App,
      AppComponents.About,
      AppComponents.Home,
      AppComponents.Nested
    ],
    imports: [
      ng2Universal.UniversalModule, // NodeModule, NodeHttpModule, and NodeJsonpModule are included
      ng2Forms.FormsModule,
      ng2Router.RouterModule.forRoot(routes),
    ],
  })
  .Class({
    constructor: function () { }
  });
