
const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.send('Rectangle-creator вас ждет');
});

module.exports = router;