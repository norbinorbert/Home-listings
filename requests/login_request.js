import express from 'express';
import bcrypt from 'bcrypt';
import * as dbUsers from '../db/db_users.js';
import { loggedInMiddleware } from '../middleware/login_status.js';

const router = express.Router();

// login page, only shown for users that are not logged in
router.get('/login', loggedInMiddleware, (req, res) => {
  res.render('login', { message: '' });
});

router.post('/login', loggedInMiddleware, express.urlencoded({ extended: true }), async (req, res) => {
  // validate form data
  if (!req.body.username) {
    res.status(400).render('login', { message: 'Please provide a username' });
    return;
  }
  if (!req.body.password) {
    res.status(400).render('login', { message: 'Please provide a password' });
    return;
  }
  const user = await dbUsers.getUserByName(req.body.username);
  if (!user) {
    res.status(400).render('login', { message: 'Incorrect username or password' });
    return;
  }
  const hashedPassword = user.Password;
  const match = await bcrypt.compare(req.body.password, hashedPassword);
  if (!match) {
    res.status(401).render('login', { message: 'Incorrect username or password' });
    return;
  }

  // successful login redirects to front page
  req.session.sessionUser = { Username: user.Username, Role: user.Role };
  res.redirect('/');
});

export default router;
