/**
 * This is the nodejs main server entry point
 */
'use strict';

// initialize logging package early so we can capture start up errors
require('./components/logs');

const config = require('./environment');

// Create and configure the express app
const app = require('./components/express').appFactory();

// register API routes
app.use('/api', require('./api'));

// TODO: insert logic here to enforce cookie session management AFTER API routes defined

// register "page" routes, i.e. angular2 universal view engine
require('./components/universal')(app);

// Error handling must be the last the express route
app.use(require('./components/errors').handleError);

// Start the server by listening on a port
app.listen(config.port, function() {
  console.log(`Listening on http://localhost:${config.port} with the ${config.env} config loaded!`); // eslint-disable-line
});

// Expose app (useful for integration and e2e testing)
exports = module.exports = app;
