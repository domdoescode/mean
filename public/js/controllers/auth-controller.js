function LoginCtrl($rootScope, $scope, $location, $window, Auth) {
    $scope.rememberme = true;
    $scope.login = function() {
      Auth.login({
          username: $scope.username,
          password: $scope.password,
          rememberme: $scope.rememberme
      },
      function(res) {
          // $cookieStore.put('user', res);
          // console.log('res is ',res);
          // if (Auth.adminUser ){
          //   $location.path('/users');
          // } else {
            $location.path('/');
          // }
      },
      function(err) {
          $rootScope.error = "Failed to login";
      });
    };
    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
};


function RegisterCtrl($rootScope, $scope, $location, Auth) {
    $scope.role = Auth.userRoles.user;
    $scope.userRoles = Auth.userRoles;

    $scope.signup = function() {
      console.log('suign');
        Auth.register({
            email: $scope.email,
            name: $scope.fullname,
            username: $scope.username,
            password: $scope.password,
            role: $scope.role
        },
        function() {
          console.log('reg ister');
            $location.path('/');
        },
        function(err) {
            $rootScope.error = err;
        });
    };
};