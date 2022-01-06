module.exports = {
  authDesigner: (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return res.redirect("/");
    }
    next();
  },
  authClient: (req, res, next) => {
    if (!req.session.clientLoggedIn) {
      return res.redirect("/");
    }
    next();
  },
  authMarketer: (req, res, next) => {
    if (!req.session.marketerLoggedIn) {
      return res.redirect("/");
    }
    next();
  },
};
