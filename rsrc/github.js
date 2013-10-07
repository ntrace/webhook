var net    = require('net');
var Domain = require('domain');
var rpc    = require('rpc-stream');
var cfg    = require('../cfg');

var github = exports;

github.run = function github_run(req, res, next) {
  var d = Domain.create();
  d.run(function() {
    var uuid = res._uuid;
    var payload = req.body;

    if (payload && typeof payload === 'object') {
      payload.status = 'init';
      payload.uuid = uuid;

      //
      // Log the time when we started doing this
      //
      payload.created_at = (new Date()).toString();
      payload.epoch = {
        created_at: Date.now()
      };

      //
      // parse the payload from github
      //
      payload = github._parsePayload(payload);

      if (payload.parsed) {

        //
        // pedro's magic goes here
        //

        //
        // Add date when we are sending this response
        //
        payload.rendered_at = (new Date()).toString();

        //
        // add epoch date, just in case
        //
        payload.epoch = payload && payload.epoch || {};
        payload.epoch.rendered_at = Date.now();

        //
        // add user from credentials to the payload
        // add http headers received and sent
        // update github status api

        //
        // connect to the dispatcher
        //
        var dispatcher = rpc();
        var dispatcherConn = net.connect(cfg.dispatcher.port);
        dispatcherConn.pipe(dispatcher).pipe(dispatcherConn);

        //
        // push the payload to the dispatcher
        //
        dispatcher.wrap(['push']).push(payload, function pushed(err) {
          if (err) throw err;
          res.send(200, "OK");
          dispatcherConn.end();
        });

      } else {
        res.send(400, {
          msg: "This doesn't seem to be a github payload. Please contact us to add aditional providers (or just copy their format)",
          code: "payload:providernotsupported",
          uuid: uuid
        });
      }

    } else {
      res.send(400, {
        msg: "The payload is not valid",
        code: "payload:invalid",
        uuid: uuid
      });
    }
  });

  var replied = false;
  d.on('error', function(err) {
    console.error(err.stack);
    if (! replied) {
      replied = true;
      res.send(500, {
        msg: err.message,
        stack: err.stack,
        uuid: uuid
      });
    }
    d.dispose();
  });
};

github._parsePayload = function _parsePayload(payload) {
  if (!payload || !payload.ref || !payload.repository || !payload.repository.owner || !payload.repository.owner.name || !payload.repository.name || !payload.after) {
    return payload;
  }

  var ref = payload.ref.split('/');

  payload.parsed = {
    branch: ref[3] || 'master',
    owner: payload.repository.owner.name,
    repo: payload.repository.name,
    slug: payload.repository.owner.name + '/' + payload.repository.name,
    commit: payload.after
  };

  return payload;
};