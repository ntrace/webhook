#!/usr/bin/env node

var env = require('../lib/env'),
  routes = require('../lib/routes'),
  server = exports;

server.run = function server_run_cb(cb) {
  env.init(function env_init_cb(api) {
    routes(api);
    env.run(api, cb);
  });
};

server.close = function server_close(cb) {
	env.server.close();
	if (cb) env.server.once('close', cb);
};

if (require.main === module)
  server.run();
