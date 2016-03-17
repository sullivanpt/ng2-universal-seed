require('angular2-universal-preview/polyfills');
const ng2Universal = require('angular2-universal-preview');

const ng2PlatformBrowser = require('angular2/platform/browser');
// const ng2Router = require('angular2/router');

const AppComponent = require('./app/app');

ng2PlatformBrowser.bootstrap(AppComponent);
//, [
//  ...ng2Router.ROUTER_PROVIDERS
// ])
// .then(ng2Universal.prebootComplete);
