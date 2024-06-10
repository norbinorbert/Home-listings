// if requested site is not found
export default function handleNotFound(req, res) {
  res
    .status(404)
    .render('error', { message: 'The requested endpoint is not found', sessionUser: req.session.sessionUser });
}
