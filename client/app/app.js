const ng2Core = require('angular2/core');

module.exports = ng2Core
  .Component({
    selector: 'app',
    template: `
    <h1>My First Angular 2 App</h1>
    <div>Hello {{name}}</div>
    <input type="text" [value]="name" (input)="name = $event.target.value" autofocus>
    `
  })
  .Class({
    constructor: function() {
      console.log('App constructor');
      this.name = 'nobody';
    }
  });

