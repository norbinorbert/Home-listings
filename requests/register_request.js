import express from 'express';
import bcrypt from 'bcrypt';
import * as dbUsers from '../db/db_users.js';
import { loggedInMiddleware } from '../middleware/login_status.js';

const router = express.Router();
// credit: https://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number
const phoneNumberRegEx =
  /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g;

// register page, only shown for users that are not logged in
router.get('/register', loggedInMiddleware, (req, res) => {
  res.render('register', { message: '' });
});

router.post('/register', loggedInMiddleware, express.urlencoded({ extended: true }), async (req, res) => {
  // validate form data
  if (!req.body.username) {
    res.status(400).render('register', { message: 'Please provide a username' });
    return;
  }
  if (!req.body.password) {
    res.status(400).render('register', { message: 'Please provide a password' });
    return;
  }
  if (!req.body.password2) {
    res.status(400).render('register', { message: 'Please confirm your password' });
    return;
  }
  if (!req.body.phone) {
    res.status(400).render('register', { message: 'Please provide a phone number' });
    return;
  }
  if (!req.body.phone.match(phoneNumberRegEx)) {
    res.status(400).render('register', { message: 'Invalid phone number format' });
    return;
  }
  if (req.body.password !== req.body.password2) {
    res.status(400).render('register', { message: "Passwords don't match" });
    return;
  }
  const user = await dbUsers.getUserByName(req.body.username);
  if (user) {
    res.status(400).render('register', { message: 'User already exists' });
    return;
  }

  // successful register
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    await dbUsers.insertUser(req.body.username, req.body.phone, hashedPassword);
  } catch (err) {
    res.status(500).render('register', { message: 'Unexpected error, register unsuccessful' });
    return;
  }
  res.redirect('/login');
});

export default router;
