var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema(
  {
    name: {type: String, required: true, maxLength: 100},
    description: {type: String, required: true, maxLength: 500},
    price: {type: Number, required: true},
    numberinstock: {type: Number, required: true},
    category: [{type: Schema.Types.ObjectId, ref: 'Category'}]
  }
);

//Price Getter
ItemSchema.path('price').get(function (num) {
    return (num / 100).toFixed(2);
});

//Price Setter
ItemSchema.path('price').set(function (num) {
    return (num * 100);
})    
    
// Virtual for item's URL
ItemSchema
.virtual('url')
.get(function () {
  return '/item/' + this._id;
});

//Export model
module.exports = mongoose.model('Item', ItemSchema);
