var Item = require('../models/item');
const { body, validationResult } = require("express-validator");
const Category = require('../models/category');


// Display detail page for a specific Item.
exports.item_detail = function(req, res, next) {
    Item.findById(req.params.id)
        .populate('category')
        .exec(function (err, item) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('item', { item: item });
        });
};

// Display Item create form on GET.
exports.item_create_get = function(req, res, next) {
    Category.find()
        .exec(function (err, category) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('item_form', { title: 'Create Item', category: category });
        })
};

// Handle Item create on POST.
exports.item_create_post = [

     (req, res, next) => {
        if(!(req.body.category instanceof Array)){
            if(typeof req.body.category ==='undefined')
            req.body.category = [];
            else
            req.body.category = new Array(req.body.category);
        }
        next();
    },

  // Validate and sanitize the name field.
    body('name', 'Item name required').trim().isLength({ min: 1 }).escape(),
    body('description', 'Item description required').trim().isLength({ min: 1 }).escape(),
    body('price', 'Item price required').trim().isLength({ min: 1 }).isNumeric().escape(),
    body('numberinstock', 'Item number in stock required').trim().isLength({ min: 1 }).isNumeric().escape(),
    body('category.*', 'Item category required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a item object with escaped and trimmed data.
    var item = new Item(
        {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            numberinstock: req.body.numberinstock,
            category: req.body.category
        }
    );

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
         Category.find()
        .exec(function (err, category) {
            if (err) { return next(err); }
            //Successful, so render
            // Mark our selected category as checked.
                for (let i = 0; i < category.length; i++) {
                    if (item.category.indexOf(category[i]._id) > -1) {
                        category[i].checked='true';
                    }
                }
            res.render('item_form', { title: 'Create Item', item: item, category: category, errors: errors.array() });
        })
      return;
    }
    else {
      // Data from form is valid.
      // Check if Item with same name already exists.
      Item.findOne({ 'name': req.body.name })
        .exec( function(err, found_item) {
           if (err) { return next(err); }

           if (found_item) {
             // Item exists, redirect to its detail page.
             res.redirect(found_item.url);
           }
           else {

             item.save(function (err) {
               if (err) { return next(err); }
               // Item saved. Redirect to item detail page.
               res.redirect(item.url);
             });

           }

         });
    }
  }
];


// Display Itemdelete form on GET.
exports.item_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Item delete on POST.
exports.item_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Item update form on GET.
exports.item_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Item update on POST.
exports.item_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};
