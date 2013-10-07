var assert = require('assert');
var request = require('request');

var server = require('../bin/server');

server.run(function() {
	var options = {
		encoding: 'utf8',
		json: require('./github_payload'),
		method: 'POST',
		url: 'http://localhost:8081/github'
	};

	request(options, function(err, res, body) {
		if (err) throw err;

		/// webhook should reply 200 to github
		assert.deepEqual(body, 'OK');
		assert.equal(res.statusCode, 200);

		/// close the server once the test is done
		server.close();
	});
});