/**
 * App components that used to be included inline in the deprecated router
 * TODO: distribute these where they belong
 */
'use strict';

const ng2Core = require('@angular/core');

exports.Home = ng2Core
  .Component({
    selector: 'home',
    template: 'Home Route'
  })
  .Class({
    constructor: function () {}
  });

exports.About = ng2Core
  .Component({
    selector: 'about',
    template: 'About Route'
  })
  .Class({
    constructor: function () {}
  });

exports.Nested = ng2Core
  .Component({
    selector: 'nested',
    template: 'Nested Route'
  })
  .Class({
    constructor: function () {}
  });
