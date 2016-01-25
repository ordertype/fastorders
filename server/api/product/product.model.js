'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProductSchema = new Schema({
  sku:  { type: String, required: true, trim: true },  
  name:  { type: String, required: true, trim: true },
  description:  { type: String, trim: true },
  price:  {type: Number, default:0, get: getPrice, set: setPrice }, 
  lastUpdate  :  { type: Date, default: Date.now },
  active :  { type: Boolean, default: true },
});

function getPrice(price){
    return price/100*2;
}

function setPrice(price){
    return price*100;
}

module.exports = mongoose.model('Product', ProductSchema);




