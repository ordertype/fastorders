'use strict';

angular.module('fastordersApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('product', {
        url: '/product',
        templateUrl: 'app/product/product.html',
        controller: 'ProductCtrl'
      }).state('viewProduct', {
        url: '/product/:id/view',
        templateUrl: 'app/product/product-edit.html',
        controller: 'ProductViewCtrl'
      }).state('editProduct', {
        url: '/product/:id/edit',
        templateUrl: 'app/product/product-edit.html',
        controller: 'ProductEditCtrl'
      }).state('newProduct',{
        url:'/product/new',
        templateUrl:'app/product/product-edit.html',
        controller:'ProductCreateController'
      });
  }).run(function($state) {
  	$state.go('product'); 
});