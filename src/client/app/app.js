'use strict';

const ng2Core = require('angular2/core');

var App = ng2Core.Component({
  selector: 'app',
  template: '<h1>My First Angular 2 App</h1>'
})
  .Class({
    constructor: function() { }
  });

module.exports = App;

