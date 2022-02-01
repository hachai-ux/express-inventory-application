var Category = require('../models/category');
var Item = require('../models/item');
var async = require('async');

const { body,validationResult } = require("express-validator");

exports.index = function(req, res, next) {
    //counter
    /*
    async.parallel({
        category_count: function(callback) {
            Category.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        item_count: function(callback) {
            Item.countDocuments({}, callback);
        },
    }, function(err, results) {
        res.render('index', { title: 'Vietnamese Restaurant Home', error: err, data: results });
    });
     */

    async.parallel({
        categories: function (callback) {
            Category.find({}, 'name description')
                .exec(callback);
        },
        items: function (callback) {
            Item.find({})
                .populate('category')
                .exec(callback);
        }
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('index', {title: 'Vietnamese Restaurant', categories: results.categories, items: results.items })
    })
};

// Display detail page for a specific Item.
exports.category_detail = function(req, res, next) {
    Category.findById(req.params.id)
        .exec(function (err, category) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('category', { category: category });
        });
};


// Display category create form on GET.
exports.category_create_get = function(req, res, next) {
    res.render('category_form', { title: 'Create Category' });
};

// Handle Category create on POST.
exports.category_create_post =  [

  // Validate and sanitize the name field.
    body('name', 'Category name required').trim().isLength({ min: 1 }).escape(),
    body('description', 'Category description required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    var category = new Category(
        {
            name: req.body.name,
            description: req.body.description
        }
    );

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('category_form', { title: 'Create Category', category: category, errors: errors.array()});
      return;
    }
    else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Category.findOne({ 'name': req.body.name })
        .exec( function(err, found_category) {
           if (err) { return next(err); }

           if (found_category) {
             // Category exists, redirect to its detail page.
             res.redirect(found_category.url);
           }
           else {

             category.save(function (err) {
               if (err) { return next(err); }
               // Item saved. Redirect to item detail page.
               res.redirect(category.url);
             });

           }

         });
    }
  }
];

// Display Category delete form on GET.
exports.category_delete_get = function(req, res, next) {

    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id).exec(callback)
        },
        category_items: function(callback) {
            Item.find({ 'category': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.category==null) { // No results.
            res.redirect('/menu');
        }
        // Successful, so render.
        res.render('category_delete', { title: 'Delete Category', category: results.category, category_items: results.category_items } );
    });

};


// Handle Category delete on POST.
exports.category_delete_post = function(req, res, next) {

    async.parallel({
        category: function(callback) {
          Category.findById(req.body.categoryid).exec(callback)
        },
        category_items: function(callback) {
          Item.find({ 'category': req.body.categoryid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.category_items.length > 0) {
            // Category has items. Render in same way as for GET route.
            res.render('category_delete', { title: 'Delete Category', category: results.category, category_items: results.category_items } );
            return;
        }
        else {
            // Category has no items. Delete object and redirect to the menu.
            Category.findByIdAndRemove(req.body.categoryid, function deleteCategory(err) {
                if (err) { return next(err); }
                // Success - go back to menu
                res.redirect('/menu')
            })
        }
    });
};


// Display Category  update form on GET.
exports.category_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Category  update on POST.
exports.category_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};
