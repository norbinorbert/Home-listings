import express from 'express';
import morgan from 'morgan';
import errorMiddleware from './middleware/error.js';
import newListingRouter from './requests/new_listing_requests.js';
import listingsRouter from './requests/show_listing_requests.js';
import picturesRouter from './requests/upload_image_requests.js';

const app = express();

// logging
app.use(morgan('tiny'));

// static files
app.use(express.static('./public'));

// template engine
app.set('view engine', 'ejs');
app.set('views', './views');

// routers
app.use('/', newListingRouter);
app.use('/', listingsRouter);
app.use('/', picturesRouter);

// error handler
app.use(errorMiddleware);

// server start
app.listen(8080, () => {
  console.log('Server listening on http://localhost:8080/ ...');
});
