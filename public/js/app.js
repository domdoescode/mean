'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'ngCookies', 'ngRoute']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    var access = routingConfig.accessLevels;

    $routeProvider.
      when('/', {
        templateUrl  : 'templates/index',
        controller   : HomeCtrl,
        access       : access.user
      })

      .when('/sign-in', {
        templateUrl:    'templates/login.jade',
        controller:     LoginCtrl,
        access:         access.anon
      })


      .when('/sign-up', {
        templateUrl:    'templates/register.jade',
        controller:     RegisterCtrl,
        access:         access.anon
      })

      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true)
  }])


.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      $rootScope.error = null;

      if (!Auth.authorize(next.access)) {

        if(Auth.isLoggedIn())               $location.path('/');
        else if(next.access.bitMask === 4 ) $location.path('/');
        else                                $location.path('/sign-in');
      }

    })

}])