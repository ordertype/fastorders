/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';


var User = require('../api/user/user.model');
var Product = require('../api/product/product.model');
var Client = require('../api/client/client.model');

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('Finished populating users');
    }
  );
});

Product.find({}).remove(function() {
  Product.create({
    sku : 'sku1',
    name : 'Champu1',
    description: 'Champu anticaspa',
    price: '110'  
  }, {
    sku : 'sku2',
    name : 'Champu1',
    description: 'Champu anticaspa',
    price: '110'  
  },{
    sku : 'sku3',
    name : 'Champu1',
    description: 'Champu anticaspa',
    price: '110'  
  },{
    sku : 'sku4',      
    name : 'Champu1',
    description: 'Champu anticaspa',
    price: '110'  
  },{
    sku : 'sku5',      
    name : 'Champu1',
    description: 'Champu anticaspa',
    price: '110'  
  },{
    sku : 'sku6',      
    name : 'Champu1',
    description: 'Champu anticaspa',
    price: '110'  
  },{
    sku : 'sku7',      
    name : 'Champu1',
    description: 'Champu anticaspa',
    price: '110'  
  },{
    sku : 'sku8',
    name : 'Champu1',
    description: 'Champu anticaspa',
    price: '110'  
  },{
    sku : 'sku9',
    name : 'Postrecitos',
    info : 'de DDL',
    price: '110'  
   }, {
    sku : 'sku10',
    name : 'Smart Build System',
    info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html',
    price: '110'  
  }, function() {
      console.log('Finished populating Products');
    });
});


Client.find({}).remove(function() {
  Product.create({
    id : 'e10',
    name : 'Alfredo Edye',
    address: 'La Rufina, La Calera',
    comment: 'Come mucho y no paga la cuenta'
  },{
    id : 'ji',
    name : 'Javier Ibaniez',
    address: 'Ba Gral Paz, Cordoba',
    comment: 'Come mucho mas que E10y pero si paga'
  },{
    id : 'gd',
    name : 'Gustavo Dobro',
    address: 'Arguello, Cordoba',
    comment: 'Pide comida light con postres con grasa'
  }, function() {
      console.log('Finished populating Clients');
    });
});