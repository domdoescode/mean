angular.module('myApp')
.controller('NavCtrl', ['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    
        console.log('nav', Auth.isLoggedIn());
    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;
    $scope.isLoggedIn = Auth.isLoggedIn();

    $scope.logout = function() {
        Auth.logout(function() {
            $location.path('/sign-in');
        }, function() {
            $rootScope.error = "Failed to logout";
        });
    };
}]);