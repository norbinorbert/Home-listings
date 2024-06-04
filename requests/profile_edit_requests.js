import express from 'express';
import bcrypt from 'bcrypt';
import { loggedOutMiddleware } from '../middleware/login_status.js';
import * as dbUsers from '../db/db_users.js';

const router = express.Router();

// renders the page where user can edit their profile
router.get('/edit_profile', loggedOutMiddleware, async (req, res) => {
  const user = await dbUsers.getUserByName(req.session.sessionUser.Username);
  let message = '';

  // check if we got redirected after changing user data
  switch (req.query.redirectFrom) {
    case 'edit_username': {
      message = 'Successfully changed username';
      break;
    }
    case 'edit_phone': {
      message = 'Successfully changed phone number';
      break;
    }
    case 'edit_password': {
      message = 'Successfully changed password';
      break;
    }
    default:
      break;
  }

  res.render('edit_profile', {
    username: user.Username,
    phone: user.Phone,
    sessionUser: req.session.sessionUser,
    message,
  });
});

// changes a users name if possible
router.post('/edit_username', loggedOutMiddleware, express.urlencoded({ extended: true }), async (req, res) => {
  const user = await dbUsers.getUserByName(req.session.sessionUser.Username);
  const newUsername = req.body.user;
  const { password } = req.body;
  if (!newUsername || !password) {
    res.status(400).render('edit_profile', {
      username: user.Username,
      phone: user.Phone,
      sessionUser: req.session.sessionUser,
      errorMessage: 'Please provide all necessary fields',
    });
    return;
  }

  // checking if password is correct
  const hashedPassword = user.Password;
  const match = await bcrypt.compare(password, hashedPassword);
  if (!match) {
    res.status(400).render('edit_profile', {
      username: user.Username,
      phone: user.Phone,
      sessionUser: req.session.sessionUser,
      errorMessage: 'Incorrect password',
    });
    return;
  }

  // checking if name is available
  const existingUser = await dbUsers.getUserByName(newUsername);
  if (existingUser) {
    res.status(400).render('edit_profile', {
      username: user.Username,
      phone: user.Phone,
      sessionUser: req.session.sessionUser,
      errorMessage: 'Name already taken',
    });
    return;
  }

  // changing database data
  try {
    await dbUsers.changeUsername(req.session.sessionUser.Username, newUsername);
  } catch (err) {
    console.log(err);
    res.status(500).render('edit_profile', {
      username: user.Username,
      phone: user.Phone,
      sessionUser: req.session.sessionUser,
      errorMessage: "Unexpected error. Couldn't change username",
    });
    return;
  }

  console.log('Changed a users name');
  // need to change session data as well
  req.session.sessionUser.Username = newUsername;
  res.redirect('/edit_profile?redirectFrom=edit_username');
});

// changes a users phone number
router.post('/edit_phone', loggedOutMiddleware, express.urlencoded({ extended: true }), async (req, res) => {
  const user = await dbUsers.getUserByName(req.session.sessionUser.Username);
  const { phone, password } = req.body;
  if (!phone || !password) {
    res.status(400).render('edit_profile', {
      username: user.Username,
      phone: user.Phone,
      sessionUser: req.session.sessionUser,
      errorMessage: 'Please provide all necessary fields',
    });
    return;
  }

  // checking if password is correct
  const hashedPassword = user.Password;
  const match = await bcrypt.compare(password, hashedPassword);
  if (!match) {
    res.status(400).render('edit_profile', {
      username: user.Username,
      phone: user.Phone,
      sessionUser: req.session.sessionUser,
      errorMessage: 'Incorrect password',
    });
    return;
  }

  // credit: https://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number
  const phoneNumberRegEx =
    /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g;

  // checking if phone number is correct format
  if (!phone.match(phoneNumberRegEx)) {
    res.status(400).render('edit_profile', {
      username: user.Username,
      phone: user.Phone,
      sessionUser: req.session.sessionUser,
      errorMessage: 'Invalid phone number format',
    });
    return;
  }

  // changing database data
  try {
    await dbUsers.changePhoneNumber(phone, req.session.sessionUser.Username);
  } catch (err) {
    console.log(err);
    res.status(500).render('edit_profile', {
      username: user.Username,
      phone: user.Phone,
      sessionUser: req.session.sessionUser,
      errorMessage: "Unexpected error. Couldn't change phone number",
    });
    return;
  }

  console.log('Changed a users phone number');
  res.redirect('/edit_profile?redirectFrom=edit_phone');
});

// changes a users password
router.post('/edit_password', loggedOutMiddleware, express.urlencoded({ extended: true }), async (req, res) => {
  const user = await dbUsers.getUserByName(req.session.sessionUser.Username);
  const oldPassword = req.body['old-password'];
  const { password } = req.body;
  const confirmPassword = req.body.password2;
  if (!oldPassword || !password || !confirmPassword) {
    res.status(400).render('edit_profile', {
      username: user.Username,
      phone: user.Phone,
      sessionUser: req.session.sessionUser,
      errorMessage: 'Please provide all necessary fields',
    });
    return;
  }

  // old and new passwords cannot match
  if (oldPassword === password) {
    res.status(400).render('edit_profile', {
      username: user.Username,
      phone: user.Phone,
      sessionUser: req.session.sessionUser,
      errorMessage: 'New password cannot be old password',
    });
    return;
  }

  // checking if new passwords match
  if (password !== confirmPassword) {
    res.status(400).render('edit_profile', {
      username: user.Username,
      phone: user.Phone,
      sessionUser: req.session.sessionUser,
      errorMessage: 'Passwords do not match',
    });
    return;
  }

  // checking if password is correct
  const hashedPassword = user.Password;
  const match = await bcrypt.compare(oldPassword, hashedPassword);
  if (!match) {
    res.status(400).render('edit_profile', {
      username: user.Username,
      phone: user.Phone,
      sessionUser: req.session.sessionUser,
      errorMessage: 'Incorrect password',
    });
    return;
  }

  // changing database data
  try {
    const newHashedPassword = await bcrypt.hash(password, 10);
    await dbUsers.changePassword(newHashedPassword, req.session.sessionUser.Username);
  } catch (err) {
    console.log(err);
    res.status(500).render('edit_profile', {
      username: user.Username,
      phone: user.Phone,
      sessionUser: req.session.sessionUser,
      errorMessage: "Unexpected error. Couldn't change password",
    });
    return;
  }

  console.log('Changed a users password');
  res.redirect('/edit_profile?redirectFrom=edit_password');
});

export default router;
