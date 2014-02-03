'use strict';





function LoginCtrl($rootScope, $scope, $location, $window, Auth, $cookieStore) {
    $scope.rememberme = true;
    $scope.error = ""

    $scope.login = function() {

      Auth.login({
        email: $scope.email,
        password: $scope.password,
        rememberme: $scope.rememberme
      },

      function(res) {

        $cookieStore.put('user', res);
        $location.path('/');

      },

      function(err) {

        $scope.error = "Failed to login";

      });
    };
    $scope.loginOauth = function(provider) {

        $window.location.href = '/auth/' + provider

    };
};


function RegisterCtrl($rootScope, $scope, $location, Auth) {
    $scope.role = Auth.userRoles.user;
    $scope.userRoles = Auth.userRoles;

    $scope.signup = function() {
        Auth.register({
            email: $scope.email,
            name: $scope.fullname,
            username: $scope.username,
            password: $scope.password,
            role: $scope.role
        },
        function() {
            $cookieStore.put('user', res);
            $location.path('/');
        },
        function(err) {
            $rootScope.error = err;
        });
    };
};