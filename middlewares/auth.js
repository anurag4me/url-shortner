const { getUser } = require("../service/auth");

// Authentication
function checkForAuthentication(req, res, next) {
  const token = req.cookies?.token;
  req.user = null;

  if (!token) return next();

  const user = getUser(token);

  req.user = user;
  return next();
}

// Authorization
function restrictTo(roles = []) {
  return function (req, res, next) {
    if (!req.user) return res.redirect("/login");

    if (!roles.includes(req.user.role)) return res.end("UnAuthorized");

    return next();
  };
}

module.exports = {
  checkForAuthentication,
  restrictTo,
};
