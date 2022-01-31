#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Category = require('./models/category')
var Item = require('./models/item')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = []
var items = []


function categoryCreate(name, description, cb) {
  categorydetail = {name: name , description: description }
  
  
  var category= new Category(categorydetail);
       
  category.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category)
  }  );
}

function itemCreate(name, description, price, numberinstock, category, cb) {
    itemdetail = { name: name, description: description, price: price, numberinstock: numberinstock, category: category };
    //check for false?
  var item = new Item(itemdetail);
       
  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item);
  });
}






function createCategories(cb) {
    async.parallel([
        function(callback) {
          categoryCreate('Vietnamese Specialities','Variety of traditional noodle meals', callback);
        },
        function(callback) {
          categoryCreate('Bao Burgers', 'Burgers based on vietnamese Banh Bao', callback);
        },
        ],
        // optional callback
        cb);
}


function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate('Pho','Rice noodles with delicious soup', 500, 30, categories[0], callback)
        },
        function(callback) {
          itemCreate('Bun', 'Thin rice noodles with delicious soup', 500, 30, categories[0], callback)
        },
        function(callback) {
            itemCreate('Havanna', 'Bao Burger with bambus', 550, 20, categories[1], callback)
        },
         function(callback) {
            itemCreate('Bambi', 'Bao Burger with sweet sour sauce and mushrooms', 600, 20, categories[1], callback)
        }
        ],
        // Optional callback
        cb);
}



async.series([
    createCategories,
    createItems
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('All done, disconnect from database: ');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});

