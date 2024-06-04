import express from 'express';
import { loggedOutMiddleware } from '../middleware/login_status.js';
import * as dbUsers from '../db/db_users.js';
import * as dbMessages from '../db/db_messages.js';

const router = express.Router();

// render main messages page, here user can choose which other user he wants to send a message to
router.get('/messages', loggedOutMiddleware, async (req, res) => {
  const users = await dbUsers.getUsersByNamePrefix('%');
  const messages = await dbMessages.getMessagesThatBelongToUser(req.session.sessionUser.Username);
  const previousUsers = [];
  messages.forEach((message) => {
    if (!previousUsers.includes(message.Source) && message.Source !== req.session.sessionUser.Username) {
      previousUsers.push(message.Source);
    }
    if (!previousUsers.includes(message.Destination) && message.Destination !== req.session.sessionUser.Username) {
      previousUsers.push(message.Destination);
    }
    if (message.Source === message.Destination && !previousUsers.includes(message.Source)) {
      previousUsers.push(message.Source);
    }
  });
  res.render('messages', { users, previousUsers, sessionUser: req.session.sessionUser });
});

// render the page the contains the exchanged messages between 2 users
router.get('/messages/:username', loggedOutMiddleware, express.urlencoded({ extended: true }), async (req, res) => {
  const { username } = req.params;
  const user = await dbUsers.getUserByName(username);
  if (!user) {
    res
      .status(404)
      .render('error', { message: "User doesn't exist or has changed name. Please go back to the messages page" });
    return;
  }
  res.render('message_user', { sessionUser: req.session.sessionUser, target: username });
});

// insert new message into database
router.post('/send_message', loggedOutMiddleware, express.json(), async (req, res) => {
  const { destination, message } = req.body;
  const user = await dbUsers.getUserByName(destination);
  if (!user) {
    res
      .status(404)
      .render('error', { message: "User doesn't exist or has changed name. Please go back to the messages page" });
    return;
  }
  const source = req.session.sessionUser.Username;
  try {
    const [dbResponse] = await dbMessages.insertMessage(source, destination, message);
    if (!dbResponse.affectedRows) {
      res.status(500).send({ message: 'Error sending message' });
      return;
    }
    res.status(200).send({ message: 'Success sending message' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Error sending message' });
  }
});

// sends messages exchanged by 2 users
router.get('/get_messages/:username', loggedOutMiddleware, express.urlencoded({ extended: true }), async (req, res) => {
  const { username } = req.params;
  const user = await dbUsers.getUserByName(username);
  if (!user) {
    res.status(404).send({ message: "User doesn't exist or has changed name. Please go back to the messages page" });
    return;
  }
  let messages;
  if (req.query.date) {
    messages = await dbMessages.getMessagesBetweenUsersAfterDate(
      req.session.sessionUser.Username,
      username,
      new Date(req.query.date),
    );
  } else {
    messages = await dbMessages.getMessagesBetweenUsers(req.session.sessionUser.Username, username);
  }
  res.send({ messages });
});

export default router;
