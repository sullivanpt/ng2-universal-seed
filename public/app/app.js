'use strict';

const ng2Core = require('@angular/core');
const ng2Http = require('@angular/http');

module.exports = ng2Core
  .Component({
    selector: 'app',
    templateUrl: 'app.html'
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
