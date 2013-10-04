var env = require('../lib/env'),
  routes = require('../lib/routes'),
  server = exports;

server.run = function server_run_cb(cb) {
  env.init(function env_init_cb(api) {
    routes(api);
    env.run(api, cb);
  });
};

if (require.main === module)
  server.run();
