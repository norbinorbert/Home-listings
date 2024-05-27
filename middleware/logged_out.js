// if user isn't logged in
export default function loggedOut(req, res, next) {
  if (!req.session.sessionUser) {
    res.status(401).render('error', {
      message: 'You need to be logged in to access this page',
      sessionUser: req.session.sessionUser,
    });
    return;
  }
  next();
}
