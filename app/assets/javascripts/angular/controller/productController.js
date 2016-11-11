var myApp = angular.module('myapplication', ['ngRoute', 'ngResource']); 

//Factory
myApp.factory('Products', ['$resource',function($resource){
  return $resource('/products.json', {},{
    query: { method: 'GET', isArray: true },
    create: { method: 'POST' }
  })
}]);

myApp.factory('Product', ['$resource', function($resource){
  return $resource('/products/:id.json', {}, {
    show: { method: 'GET' },
    update: { method: 'PUT', params: {id: '@id'} },
    delete: { method: 'DELETE', params: {id: '@id'} }
  });
}]);

//Controller
myApp.controller("ProductListCtr", ['$scope', '$http', '$resource', 'Products', 'Product', '$location', function($scope, $http, $resource, Products, Products, $location) {

  $scope.products = Products.query();

  $scope.deleteProduct = function (producId) {
    if (confirm("Are you sure you want to delete this product?")){
      Product.delete({ id: productId }, function(){
        $scope.products = Products.query();
        $location.path('/');
      });
    }
  };
}]);

myApp.controller("ProductUpdateCtr", ['$scope', '$resource', 'Product', '$location', '$routeParams', function($scope, $resource, Product, $location, $routeParams) {
  $scope.product = Product.get({id: $routeParams.id})
  $scope.update = function(){
    if ($scope.productForm.$valid){
      Product.update({id: $scope.product.id},{product: $scope.product},function(){
        $location.path('/');
      }, function(error) {
        console.log(error)
      });
    }
  };
}]);

  //Routes
myApp.config([
  '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/products',{
      templateUrl: '/templates/products/index.html',
      controller: 'ProductListCtr'
    });
    // $routeProvider.when('/products/new', {
    //   templateUrl: '/templates/products/new.html',
    //   controller: 'UserAddCtr'
    // });
    $routeProvider.when('/products/:id/edit', {
      templateUrl: '/templates/products/edit.html',
      controller: "ProductUpdateCtr"
    });
    $routeProvider.otherwise({
      redirectTo: '/products'
    });
  }
]);
