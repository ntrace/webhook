var version = require('../package.json').version;

module.exports = function api_version_mw(req, res, next) {
  res.setHeader('x-api-version', version);
  res._api_version = version;
  req._api_version = version;
  next();
};
