'use strict';

angular.module('fastordersApp')
  .controller('ProductCtrl', function ($state, $scope, $http, Auth, User, $location, socket) {

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
 //      var dlg = dialogs.confirm();
 //      dlg.result.then(function(btn){
         $http.delete('/api/products/' + product.entity._id).success(function(product, $state) {
            $scope.productsGrid.data.splice(index, 1);
            //Notification.success({message: 'Product ' + productName + ' Deleted', title: 'Delete operation'});
          })
 //      },function(btn){
           // Notification.success({message: 'Product ' + productName + ' Delete cancelled', title: 'Delete operation'});
 //      });
       };
       
    $scope.viewProduct = function(product) {
       $state.go('viewProduct',{id: product._id});
     
    };

   
  })
  .controller('ProductViewCtrl',function ($state, $scope,$location,  $http, $stateParams, Auth, User) {  
    $scope.productSchema = {
    "type": "object",
    "title": "Comment",
    "properties": {
        "sku": {
        "title": "SKU",
        "type": "string"
        },
        "name": {
        "title": "Name",
        "type": "string",
        "htmlClass": "col-sm-3",
        "fieldHtmlClass": "form-control",
        "labelHtmlClass": "col-sm-2 control-label",
        "description": "Product Name."
        },
        "description": {
        "title": "Description",
        "type": "string",
        "maxLength": 20,
        "validationMessage": "Don't be greedy!"
        }
    },
    "required": [
        "sku",
        "name",
        "description"
    ]
    };

    $scope.form = [
    "sku",
    "name",
    {
        "key": "description",
        "type": "textarea",
        "placeholder": "Make a comment"
    },
    {
        "type": "submit",
        "style": "btn-info",
        "title": "OK"
    }
    ];

    $scope.model = {};
  
      $scope.product = '';

      $scope.submitButton = "Edit";
      $scope.secondButton = "Return";     
      $scope.isReadOnly = true;
      $http.get('/api/products/' + $stateParams.id).success(function(product) {
          $scope.product = product;
      });
  
      $scope.cancel = function() {
        $state.go('product');
      }; 
      
      $scope.updateProduct = function() {
        $scope.isReadOnly = false;
        $state.go('editProduct',{id: $scope.product._id});
      };    
     
  }).controller('ProductCreateController',function($state, $scope,$http,$stateParams, $location){

    $scope.product= {};
    $scope.submitButton = "Create";
    $scope.secondButton = "Cancel";     
    $scope.addProduct = function(){
      var productName = $scope.product.name;
     // var dlg = dialogs.confirm("Alert", "Please confirm creating the product " + productName);
      
 
      // dlg.result.then(function(btn){
         $http.post('/api/products', $scope.product).success(function(product, $state) {
            $state.go('product');
            // Notification.success({message: 'Product ' + productName + ' created', title: 'Create operation'});
        }).error(function(data, status, headers, config) {
            // Notification.error({message: 'Product ' + productName + ' was not created', title: 'Create operation'});
            // Notification.error({message: 'Error: ' + data.err, title: 'Create operation'});  
        })
      // },function(btn){
      //      $state.go('product');
            //Notification.success({message: 'Product ' + productName + ' create cancelled', title: 'Create operation'});
      // });
        
        };
    
    $scope.cancel = function() {
      $state.go('product');
      //Notification.success({message: 'Product create cancelled', title: 'Create operation'});
    }

  }).controller('ProductEditCtrl',function ($state, $scope,  $http,  $location, $stateParams, Auth, User) {  

   $scope.product = '';

   

   $scope.updateProduct = function(){
       
        //var dlg = dialogs.confirm();
      // dlg.result.then(function(btn){
           
            $http.put('/api/products/' + $stateParams.id, $scope.product).success(function(product, $state) {
              //  Notification.success({message: 'Product ' + $scope.product.name + ' Updated', title: 'Update operation'});
            })           
            $state.go('viewProduct',{id: $scope.product._id});

       },function(btn){
           // Notification.success({message: 'Product ' + $scope.product.name + ' Update cancelled', title: 'Update operation'});
      // });      
     };

    $scope.loadProduct = function(){
      $scope.submitButton = "Save";
      $scope.secondButton = "Cancel";           
      $http.get('/api/products/' + $stateParams.id).success(function(product) {
          $scope.product = product;
      })
    };

    $scope.loadProduct();
    
    $scope.cancel = function() {
        $http.get('/api/products/' + $stateParams.id).success(function(product) {
            
        })
      $state.go('viewProduct',{id: $scope.product._id});
    };

    
  });
