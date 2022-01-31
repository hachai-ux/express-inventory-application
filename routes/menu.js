var express = require('express');
var router = express.Router();

var category_controller = require('../controllers/categoryController');
var item_controller = require('../controllers/itemController');

// Home page route.
router.get('/', function (req, res) {
  res.send('Category home page');
})







module.exports = router;
