module.exports = function logger_mw(req, res, next) {
  req.log.info({
    req: {
      method: req.method,
      url: req.url
    },
    res: res,
    uuid: req._uuid
  });
  next();
};
