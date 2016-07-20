/**
 * Application routes for router 3
 */
'use strict';

// const ng2Router = require('@angular/router');
const AppComponents = require('./app/app-components');

module.exports = [
  { path: '', component: AppComponents.Home }, // TODO: why does this throw server side: Error: Cannot find primary outlet to load ''
  { path: 'home', component: AppComponents.Home },
  { path: 'about', component: AppComponents.About }, // TODO: why does this throw an exception but 'about/fred' doesn't?
  { path: 'about/nested', component: AppComponents.Nested },
  // instead of this default route we want 404 { path: '/**', redirectTo: ['Home'] }
];
