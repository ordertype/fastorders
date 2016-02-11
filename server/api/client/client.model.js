'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ClientSchema = new Schema({
  id:  { type: String, 
         required: true, 
         trim: true,
         index: {unique: true}},  
  name:  { type: String, 
           required: true, 
           trim: true },
  address:  { type: String, 
              trim: true },
  comment:  {type: String, 
             trim: true  },
  dob: {type: Date, 
        default: new Date()},
  lastUpdate: { type: Date, 
                default: Date.now },
  active :  {type: Boolean, 
             default: true },
});


module.exports = mongoose.model('Client', ClientSchema);




