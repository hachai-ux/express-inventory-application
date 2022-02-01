var Item = require('../models/item');
const { body, validationResult } = require("express-validator");
const Category = require('../models/category');
const async = require('async');


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
        .exec(function (err, categories) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('item_form', { title: 'Create Item', categories: categories });
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
        .exec(function (err, categories) {
            if (err) { return next(err); }
            //Successful, so render
            // Mark our selected category as checked.
                for (let i = 0; i < categories.length; i++) {
                    if (item.category.indexOf(categories[i]._id) > -1) {
                        categories[i].checked='true';
                    }
                }
            res.render('item_form', { title: 'Create Item', item: item, categories: categories, errors: errors.array() });
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
exports.item_delete_get = function(req, res, next) {

        //item carries category data
    Item.findById(req.params.id)
        .populate('category')
        .exec(function (err, item) {
            if (err) { return next(err); }
            //Successful, so render
            if (item==null) { // No results.
            res.redirect('/menu');
            }
            // Successful, so render.
            res.render('item_delete', { title: 'Delete Item', item: item } );
        })
     
};

// Handle Author delete on POST.
exports.item_delete_post = function (req, res, next) {
    
    //item carries category data
    Item.findByIdAndRemove(req.body.itemid, function deleteItem(err) {
        if (err) { return next(err); }
        //Successful, so render
        res.redirect('/menu');
    })
};
   


// Display item update form on GET.
exports.item_update_get = function(req, res, next) {

    // Get item and categories for form.
    async.parallel({
        item: function(callback) {
            Item.findById(req.params.id).populate('category').exec(callback);
        },
        categories: function(callback) {
            Category.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.item==null) { // No results.
                var err = new Error('Item not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render('item_form', { title: 'Update Item', item: results.item, categories: results.categories });
        });

};


// Handle item update on POST.
exports.item_update_post = [

    // Convert the categories to an array
    (req, res, next) => {
        if(!(req.body.category instanceof Array)){
            if(typeof req.body.category==='undefined')
            req.body.category=[];
            else
            req.body.category=new Array(req.body.category);
        }
        next();
    },

    // Validate and sanitize fields.
    body('name', 'Item name required').trim().isLength({ min: 1 }).escape(),
    body('description', 'Item description required').trim().isLength({ min: 1 }).escape(),
    body('price', 'Item price required').trim().isLength({ min: 1 }).isNumeric().escape(),
    body('numberinstock', 'Item number in stock required').trim().isLength({ min: 1 }).isNumeric().escape(),
    body('category.*', 'Item category required').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create an Item object with escaped/trimmed data and old id.
        var item = new Item(
          { name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            numberinstock: req.body.numberinstock,
            category: (typeof req.body.category==='undefined') ? [] : req.body.category,
            _id:req.params.id //This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            Category.find()
            .exec(function (err, categories) {
            if (err) { return next(err); }
            //Successful, so render
            // Mark our selected category as checked.
                for (let i = 0; i < categories.length; i++) {
                    if (item.category.indexOf(categories[i]._id) > -1) {
                        categories[i].checked='true';
                    }
                }
            res.render('category_form', { title: 'Create Category', categories: categories, item: item, errors: errors.array() });
        })
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Item.findByIdAndUpdate(req.params.id, item, {}, function (err,theitem) {
                if (err) { return next(err); }
                   // Successful - redirect to item detail page.
                   res.redirect(theitem.url);
                });
        }
    }
];
