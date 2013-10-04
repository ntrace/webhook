//
// ### function uuidMW(req, res)
//
// Sets a `x-api-uuid` http header
// with the uuid of the current request
//
module.exports = function uuidMW(req, res, next) {
  var uuid = (~~(Math.random() * 1e9)).toString(36) + Date.now();
  res.setHeader("x-api-uuid", uuid);
  res._uuid = uuid;
  req._uuid = uuid;
  next();
};
