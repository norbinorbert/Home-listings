// if user isn't logged in
export function loggedOutMiddleware(req, res, next) {
  if (!req.session.sessionUser) {
    res.status(401).render('error', {
      message: 'You need to be logged in to access this page',
      sessionUser: req.session.sessionUser,
    });
    return;
  }
  next();
}

// if user is logged in
export function loggedInMiddleware(req, res, next) {
  if (req.session.sessionUser) {
    res.status(403).render('error', {
      message: "You are already logged in and can't perform this action again",
      sessionUser: req.session.sessionUser,
    });
    return;
  }
  next();
}

// check if user is an admin
export function adminCheckMiddleware(req, res, next) {
  if (req.session.sessionUser.Role !== 'admin') {
    res.status(403).render('error', {
      message: 'You need to be an administrator to access this',
      sessionUser: req.session.sessionUser,
    });
    return;
  }
  next();
}
