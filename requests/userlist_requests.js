import express from 'express';
import * as dbUsers from '../db/db_users.js';
import { adminCheckMiddleware, loggedOutMiddleware } from '../middleware/login_status.js';

const router = express.Router();

// renders the userlist page
router.get('/userlist', loggedOutMiddleware, adminCheckMiddleware, (req, res) => {
  res.render('userlist', { sessionUser: req.session.sessionUser });
});

// send the users that match the criteria
router.get(
  '/get_users_prefix',
  loggedOutMiddleware,
  adminCheckMiddleware,
  express.urlencoded({ extended: true }),
  async (req, res) => {
    const searchResults = await dbUsers.getUsersByNamePrefix(req.query.prefix);
    res.send({ searchResults });
  },
);

// changes the role of the given user
router.post('/change_role', loggedOutMiddleware, adminCheckMiddleware, express.json(), async (req, res) => {
  const { username } = req.body;
  const { role } = req.body;
  if (req.session.sessionUser.Username === username) {
    res.status(400).send({ message: 'You are not allowed to change your own role' });
    return;
  }
  console.log(`Request to change the role of user ${username}`);
  await dbUsers.changeUserRole(username, role);
  res.send({ message: `Changed role of ${username}` });
});

export default router;
