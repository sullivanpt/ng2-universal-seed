/**
 * Application routes for router 3
 */
'use strict';

// const ng2Router = require('@angular/router');
const AppComponents = require('./app/app-components');

module.exports = [
  { path: '', component: AppComponents.Home },
  { path: 'home', component: AppComponents.Home },
  { path: 'about', component: AppComponents.About },
  { path: 'about/nested', component: AppComponents.Nested },
  // instead of this default route we want 404 { path: '/**', redirectTo: ['Home'] }
];
