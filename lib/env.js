var fs = require('fs'),
  restify = require('restify'),
  pkgjson = require('../package.json'),
  cfg = require('../cfg'),
  env = exports;

var server = restify.createServer({
  name: pkgjson.name,
  version: pkgjson.version,
  log: restify.bunyan.createLogger({
    name: pkgjson.name,
    level: 'info',
    stream: process.stdout,
    serializers: restify.bunyan.serializers
  })
});

env.server = server;

env.init = function env_init(cb) {
  server.log.level('info');

  server.use(restify.acceptParser(server.acceptable));
  server.use(require('../mw/uuid'));
  server.use(require('../mw/api_version'));
  server.use(require('../mw/logger'));
  server.use(restify.queryParser());
  server.use(restify.gzipResponse());
  server.use(restify.bodyParser({
    mapParams: false
  }));

  server.use(restify.throttle({
    burst: 100,
    rate: 50,
    ip: true
  }));

  cb(server);
};

env.run = function env_run(app, cb) {
  cb = cb || function () {};

  server.listen(cfg.port || 8080, function () {
    var startLog = {
      port: cfg.port || 8080,
      version: pkgjson.version,
      log_level: server.log.level()
    };

    startLog[pkgjson.name] = 'ok';
    server.log.info(startLog, 'app is now started');
    cb();
  });
};
