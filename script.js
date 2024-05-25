import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import errorMiddleware from './middleware/error.js';
import newListingRouter from './requests/new_listing_requests.js';
import listingsRouter from './requests/show_listing_requests.js';
import picturesRouter from './requests/upload_image_requests.js';
import deletePictureRouter from './requests/delete_image_request.js';
import loginRouter from './requests/login_requests.js';
import registerRouter from './requests/register_requests.js';
import logoutRouter from './requests/logout_requests.js';

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
    secret: 'asd',
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

// error handler
app.use(errorMiddleware);

// server start
app.listen(8080, () => {
  console.log('Server listening on http://localhost:8080/ ...');
});
