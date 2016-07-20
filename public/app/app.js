'use strict';

const ng2Core = require('@angular/core');
const ng2Router = require('@angular/router');
const ng2Http = require('@angular/http');

module.exports = ng2Core
  .Component({
    selector: 'app',
    directives: [
      ng2Router.ROUTER_DIRECTIVES,
    ],
    template: `
    <h1>Client &amp; Server App</h1>
    <div>Hello {{name}}</div>
    <input type="text" [value]="name" (input)="name = $event.target.value" autofocus>
    <hr>
    <pre>{{ apiData | json }}</pre>
    <button (click)="apiTest()">API Test</button>
    <hr>
    <nav>
      <a [routerLink]="['./home']" [routerLinkActive]="['active']">Home</a>
      <a [routerLink]="['./about']" [routerLinkActive]="['active']">About</a>
      <a [routerLink]="['./about/nested']" [routerLinkActive]="['active']">Nested</a>
    </nav>
    <main>
      <router-outlet></router-outlet>
    </main>
    `
  })
  .Class({
    constructor: [ng2Http.Http, function(http) {
      console.log('App constructor');
      this.http = http;
      this.name = 'nobody';
      this.apiData = { notcalled: 'yet' };
    }],
    ngOnInit: function () {
      // TODO: this API gets called twice, once server side, once client side, why?
      this.apiTest();
    },
    apiTest: function () {
      // we need to use full urls for the server to work
      // TODO: use config to get path
      this.http.get('http://localhost:9000/api/test/timestamp')
        .subscribe(res => { // TODO: will subscribe remove itself?
          this.apiData = res.json();
        });
    }
  });
