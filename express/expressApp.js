const express = require('express');

const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');

const mainRoutes = require('./routes/main');
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', express.static(path.join(__dirname, '../dist')));
//app.use('/', mainRoutes);

// обработка 404
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// рендерим ошибки во время dev
app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;