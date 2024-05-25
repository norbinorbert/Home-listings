import express from 'express';
import bcrypt from 'bcrypt';
import * as dbUsers from '../db/db_users.js';

const router = express.Router();

// login page, only shown for users that are not logged in
router.get('/login', (req, res) => {
  if (req.session.sessionUser) {
    res.status(401).redirect('/');
    return;
  }
  res.render('login', { message: '' });
});

router.post('/login', express.urlencoded({ extended: true }), async (req, res) => {
  // only users that aren't logged in can send login requests
  if (req.session.sessionUser) {
    res.status(401).redirect('/');
    return;
  }

  // validate form data
  if (!req.body.username) {
    res.status(400).render('login', { message: 'Please provide a username' });
    return;
  }
  if (!req.body.password) {
    res.status(400).render('login', { message: 'Please provide a password' });
    return;
  }
  const [users] = await dbUsers.getUserByName(req.body.username);
  if (users.length === 0) {
    res.status(400).render('login', { message: 'Incorrect username or password' });
    return;
  }
  const user = users[0];
  const hashedPassword = user.Password;
  const match = await bcrypt.compare(req.body.password, hashedPassword);
  if (!match) {
    res.status(401).render('login', { message: 'Incorrect username or password' });
    return;
  }

  // successful login redirects to front page
  req.session.sessionUser = user.Username;
  res.redirect('/');
});

export default router;
