const ng2Core = require('angular2/core');

module.exports = ng2Core
  .Component({
    selector: 'server-only-app',
    template: `
    <h1>Server Only App Activated</h1>
    `
  })
  .Class({
    constructor: function() {
      console.log('Server Only App constructor');
    }
  });

