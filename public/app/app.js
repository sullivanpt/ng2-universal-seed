'use strict';

const ng2Core = require('angular2/core');
const ng2Router = require('angular2/router');

const Home = ng2Core
  .Component({
    selector: 'home',
    template: 'Home Route'
  })
  .Class({
    constructor: function () {}
  });

const About = ng2Core
  .Component({
    selector: 'about',
    template: 'About Route'
  })
  .Class({
    constructor: function () {}
  });

const Nested = ng2Core
  .Component({
    selector: 'nested',
    template: 'Nested Route'
  })
  .Class({
    constructor: function () {}
  });

module.exports = ng2Router.RouteConfig([ // TODO: semantics seem akward, source http://www.codeproject.com/Articles/1078872/Angular-RouteConfig-with-ES-and-ES
    { path: '/', component: Home, name: 'Home', useAsDefault: true },
    { path: '/home', component: Home, name: 'Home' },
    { path: '/about', component: About, name: 'About' },
    { path: '/about/nested', component: Nested, name: 'Nested' },
    // instead of this default route we want 404 { path: '/**', redirectTo: ['Home'] }
])(ng2Core
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
    <nav>
      <a [routerLink]=" ['./Home'] ">Home</a>
      <a [routerLink]=" ['./About'] ">About</a>
      <a [routerLink]=" ['./Nested'] ">Nested</a>
    </nav>
    <main>
      <router-outlet></router-outlet>
    </main>
    `
  })
  .Class({
    constructor: function() {
      console.log('App constructor');
      this.name = 'nobody';
    }
  }));
