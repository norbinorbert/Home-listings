import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import errorMiddleware from './middleware/error.js';
import newListingRouter from './requests/new_listing_request.js';
import listingsRouter from './requests/show_listing_requests.js';
import picturesRouter from './requests/upload_image_request.js';
import deletePictureRouter from './requests/delete_image_request.js';
import loginRouter from './requests/login_request.js';
import registerRouter from './requests/register_request.js';
import logoutRouter from './requests/logout_request.js';
import userListRouter from './requests/userlist_requests.js';
import deleteListingRouter from './requests/delete_listing_request.js';
import messageRouter from './requests/message_requests.js';

const app = express();

// logging
app.use(morgan('tiny'));

// static files
app.use(express.static('./public'));

// template engine
app.set('view engine', 'ejs');
app.set('views', './views');

// session middleware
app.use(
  session({
    secret: 'rYOf9b4zbC9F3C5TfbWfM+QQFx8lKDnPacCqEeuTOqCenvZu0WsuLZiF3duTqgAdqU+timEma1e6xg4rdz6GdA==',
    resave: false,
    saveUninitialized: false,
  }),
);

// routers
app.use('/', newListingRouter);
app.use('/', listingsRouter);
app.use('/', picturesRouter);
app.use('/', deletePictureRouter);
app.use('/', loginRouter);
app.use('/', registerRouter);
app.use('/', logoutRouter);
app.use('/', userListRouter);
app.use('/', deleteListingRouter);
app.use('/', messageRouter);

// error handler
app.use(errorMiddleware);

// server start
app.listen(8080, () => {
  console.log('Server listening on http://localhost:8080/ ...');
});
