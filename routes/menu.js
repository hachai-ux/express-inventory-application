var express = require('express');
var router = express.Router();

var category_controller = require('../controllers/categoryController');
var item_controller = require('../controllers/itemController');

/// CATEGORY ROUTES ///

// Home page route.
router.get('/', category_controller.index);

// GET request for creating a Category. NOTE This must come before routes that display Category (uses id).
router.get('/category/create', category_controller.category_create_get);

// POST request for creating Category.
router.post('/category/create', category_controller.category_create_post);

// GET request to delete Category.
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request to delete Category.
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request to update Category.
router.get('/category/:id/update', category_controller.category_update_get);

// POST request to update Category.
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one Category.
router.get('/category/:id', category_controller.category_detail);

// GET request for list of all Category items.
router.get('/categories', category_controller.category_list);


/// ITEM ROUTES ///

// GET request for creating an Item. NOTE This must come before route that displays Item (uses id).
router.get('/item/create', item_controller.item_create_get);

// POST request for creating BookInstance.
router.post('/item/create', item_controller.item_create_post);

// GET request to delete BookInstance.
router.get('/item/:id/delete', item_controller.item_delete_get);

// POST request to delete BookInstance.
router.post('/item/:id/delete', item_controller.item_delete_post);

// GET request to update BookInstance.
router.get('/item/:id/update', item_controller.item_update_get);

// POST request to update BookInstance.
router.post('/item/:id/update', item_controller.item_update_post);

// GET request for one BookInstance.
router.get('/item/:id', item_controller.item_detail);

// GET request for list of all BookInstance.
router.get('/items', item_controller.item_list);


module.exports = router;
