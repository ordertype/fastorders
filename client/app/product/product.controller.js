'use strict';

      var schema = {
          type: "object",
          properties: {
              sku: {  type: "string",
                      minLength: 2, 
                      title: "SKU"},
              name: { type: "string", 
                      minLength: 2,
                      title: "Name" },
              description: { type: "string", 
                      minLength: 2, 
                      title: "Description" },
              price: { type: "string", 
                      minLength: 2, 
                      title: "Price" },
              lastUpdate: { type: "string", 
                      title: "Last update", 
                      description: "The date and time the product was updated" }                                                                  
          }    
      };

     var form = [
           { key: "sku",
             placeholder: "SKU identifier for the product"}, 
           { key: "name", 
             placeholder: "Product Name"},
           { key: "description", 
             placeholder: "Product Description"},
           { key: "price", 
             placeholder: "Product Price"}

      ];

angular.module('fastordersApp')
  .controller('ProductCtrl', function ($state, $scope, $http, Auth, User, $location, socket, Notification, dialogs) {

  	$scope.awesomeProducts = [];
    
    $scope.productsGrid = {
      enableFiltering: true,
      enableSorting: true,
      infiniteScrollRowsFromEnd: 40,
      infiniteScrollUp: true,
      infiniteScrollDown: true,
      rowHeight: 40,
      columnDefs: [
        { name: 'SKU',
            headerCellClass: 'grid-align-center',
            field: 'sku' },
        { name: 'Name',
            headerCellClass: 'grid-align-center',
            field: 'name' },
        { name: 'Description',
            headerCellClass: 'grid-align-center',
            field: 'description' }, 
        { name: 'Price',
            cellClass: 'grid-align-right',
            headerCellClass: 'grid-align-center',
            cellFilter: 'currency',
            width: "15%",
            field: 'price' },   
        { name: 'Last Update',
            cellClass: 'grid-align-center', 
            headerCellClass: 'grid-align-center', 
            field: 'lastUpdate',
            cellFilter: 'date'},                       
        { name: 'Actions',
            cellClass: 'grid-align-center', 
            headerCellClass: 'grid-align-center',                       
            enableColumnMenu: false,
            enableFiltering: false,
            enableSorting: false,
            cellTemplate:'<button class="btn btn-primary" ng-click="grid.appScope.viewProduct(row.entity)">View</button> <button class="btn btn-danger" ng-click="grid.appScope.deleteProduct(row)">Delete</button>' 
        }
      ],
      onRegisterApi: function( gridApi ) {
        $scope.grid1Api = gridApi;
      }
    };    

    $http.get('/api/products').success(function(awesomeProducts) {
      $scope.awesomeProducts = awesomeProducts;
      $scope.productsGrid.data = awesomeProducts;
    });

    $scope.deleteProduct = function(product) {
       var index = $scope.productsGrid.data.indexOf(product.entity);    
       var productName = product.entity.name;
       var dlg = dialogs.confirm();
       dlg.result.then(function(btn){
         $http.delete('/api/products/' + product.entity._id).success(function(product, $state) {
            $scope.productsGrid.data.splice(index, 1);
            Notification.success({message: 'Product ' + productName + ' Deleted', title: 'Delete operation'});
          })
       },function(btn){
            Notification.success({message: 'Product ' + productName + ' Delete cancelled', title: 'Delete operation'});
       });
       };
       
    $scope.viewProduct = function(product) {
       $state.go('viewProduct',{id: product._id});
     
    };

   
  })
  .controller('ProductViewCtrl',function ($state, $scope, $location,  $http, $stateParams, Auth, User) {  
      
      $scope.onSubmit = function (form) {

          for (var i in $scope.form) {
              var object = $scope.form[i];
              if (object.hasOwnProperty("key")) {
                  object.readonly = $scope.isEditMode;
              }
          }
          
        $state.go('editProduct',{id: $scope.model._id});
 
      } 
      
      $scope.cancel = function () {
          $state.go('product');
      }; 

      $scope.initialize = function () {
          $scope.product = '';
          $scope.isEditMode = false;
          
          $scope.schema = schema;
          $scope.form = form;
          $scope.model = {};
          
          $scope.submitButton = "Edit";
          $scope.secondButton = "Return";
          
          $http.get('/api/products/' + $stateParams.id).success(function (product) {
              $scope.model = product;

              for (var i in $scope.form) {
                  var object = $scope.form[i];
                  if (object.hasOwnProperty("key")) {
                      object.readonly = !$scope.isEditMode;
                  }
              }

          });
      };

      $scope.initialize();
     
  }).controller('ProductCreateController',function($state, $scope,$http,$stateParams, $location,Notification, dialogs){

    $scope.product= {};
    $scope.submitButton = "Create";
    $scope.secondButton = "Cancel";  

    $scope.schema = schema;
    $scope.form = form; 
    $scope.model = {};           
       
    $scope.onSubmit = function () {
        var productName = $scope.model.name;
        var dlg = dialogs.confirm("Alert", "Please confirm creating the product " + productName);


        dlg.result.then(function (btn) {
            $http.post('/api/products', $scope.model).success(function (product, $state) {
                $state.go('product');
                Notification.success({ message: 'Product ' + productName + ' created', title: 'Create operation' });
            }).error(function (data, status, headers, config) {
                Notification.error({ message: 'Product ' + productName + ' was not created', title: 'Create operation' });
                Notification.error({ message: 'Error: ' + data.err, title: 'Create operation' });
            })
        }, function (btn) {
            $state.go('product');
            Notification.success({ message: 'Product ' + productName + ' create cancelled', title: 'Create operation' });
        });

    };

    $scope.cancel = function () {
        $state.go('product');
        Notification.success({ message: 'Product create cancelled', title: 'Create operation' });
    }

  }).controller('ProductEditCtrl',function ($state, $scope,  $http,  $location, $stateParams, Auth, User, Notification, dialogs) {  

      $scope.product = '';

      $scope.schema = schema;
      $scope.form = form;


      $scope.onSubmit = function () {

          var dlg = dialogs.confirm();
          dlg.result.then(function (btn) {

              $http.put('/api/products/' + $stateParams.id, $scope.model).success(function (product, $state) {
                  Notification.success({ message: 'Product ' + $scope.model.name + ' Updated', title: 'Update operation' });
              })
              $state.go('viewProduct', { id: $scope.model._id });

          }, function (btn) {
              Notification.success({ message: 'Product ' + $scope.model.name + ' Update cancelled', title: 'Update operation' });
          });
      };

      $scope.loadProduct = function () {
          $scope.submitButton = "Save";
          $scope.secondButton = "Cancel";
          $http.get('/api/products/' + $stateParams.id).success(function (product) {
              $scope.model = product;
          })
      };

      $scope.loadProduct();

      $scope.cancel = function () {
          $http.get('/api/products/' + $stateParams.id).success(function (product) {

          })
          $state.go('viewProduct', { id: $scope.product._id });
      };

    
  });
