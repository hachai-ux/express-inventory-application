var Category = require('../models/category');
var Item = require('../models/item');
var async = require('async');

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



// Display Category create form on GET.
exports.category_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle Category  create on POST.
exports.category_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create POST');
};

// Display Category  delete form on GET.
exports.category_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Category  delete on POST.
exports.category_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Category  update form on GET.
exports.category_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Category  update on POST.
exports.category_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};
