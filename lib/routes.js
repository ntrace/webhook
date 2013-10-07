var github = require('../rsrc/github');

module.exports = function src_routes(api) {
  api.post('/github', github.run);
};