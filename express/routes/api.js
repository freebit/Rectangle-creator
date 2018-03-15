
const router = require('express').Router();
const mongoose = require('mongoose');
const Rectangle = require('../models/Rectangle.js');

// получаем все прямоугольники
router.get('/all', (req, res, next) => {
  Rectangle.find((err, data) => {
    if (err) return next(err);
    res.json(data);
  });
});

// создаем прямоугольник
router.post('/', (req, res, next) => {
  Rectangle.create(req.body, (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

// обновляем прямоугольник
router.put('/:id', (req, res, next) => {
  Rectangle.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});


module.exports = router;