'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('usersLink', function() {
    return {
      restrict: 'A',
      replace: true,
      template: '<a class="btn btn-white" ng-show="isAdmin" href="users"> Users </a>',
      controller: ['$scope', '$http','Auth', function($scope, $http, Auth) {
        $scope.isAdmin = Auth.isAdminUser()
      }]
    }
  })
  .directive('navigation', function() {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: '/templates/navigation',
      controller: ['$scope', '$http','Auth', '$location', function($scope, $http, Auth, $location) {
        $scope.adminUser = Auth.isAdminUser()
      }]
    }
  })
  .directive('toolbarMenu', function() {
    return {
        // Restrict it to be an attribute in this case
        restrict: 'A',
        // responsible for registering DOM listeners as well as updating the DOM
        link: function(scope, element, attrs) {
          $(element).dlmenu({
            animationClasses : { classin : 'dl-animate-in-5', classout : 'dl-animate-out-5' }
          });
        }
    };
});