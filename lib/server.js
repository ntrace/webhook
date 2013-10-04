var Hapi = require('hapi');

var options = require('./options');
var port = 8080;
var server = module.exports = new Hapi.Server('0.0.0.0', port, options);

console.log('Webapp server listening on port %d', server.info.port);

require('./routes');
