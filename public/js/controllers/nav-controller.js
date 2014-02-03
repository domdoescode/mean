'use strict';


function NavCtrl($scope, $routeParams, $rootScope, $http, Auth, $location, Users) {

    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;
    $scope.isLoggedIn = Auth.isLoggedIn();


    $scope.logout = function() {

        Auth.logout ( function( )
        {

            $location.path('/sign-out')

        }, function ( ) {

            $scope.error = "Failed to logout"

        })
    };
}