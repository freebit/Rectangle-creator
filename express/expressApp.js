const express = require('express');

const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');


const apiRoutes = require('./routes/api');
const app = express();

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://r-creator:r-creator@ds213759.mlab.com:13759/rectangle-creator', { 
  promiseLibrary: mongoose.Promise 
})
  .then(() =>  console.log('mongodb connection succesful'))
  .catch((err) => console.error(err));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, '../dist')));

app.use('/', express.static(path.join(__dirname, '../dist')));

// разрешим CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Headers", "json, X_REQUESTED_WITH, Content-Type");
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
  next();
});

app.use('/rectangle', apiRoutes);

// обработка 404
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// рендерим ошибки во время dev
app.use((err, req, res, next) => {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;