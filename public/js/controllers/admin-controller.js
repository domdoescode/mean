function UsersCtrl($rootScope, $scope, $location, $window, Auth, Users) {
    Users.getAll(
      function(res) {
          // console.log(res);
          $scope.users = res.users
      },
      function(err) {
          $rootScope.error = "Users not found";
      });
};


function UserCtrl($routeParams, $rootScope, $scope, $location, $window, Auth, Users) {
    Users.getFromId($routeParams.id
      ,function(res) {
          $scope.user = res.user
          Users.getUsersFeeds($routeParams.id
            ,function(feeds) {
              $scope.feeds = feeds.feeds;
            },
            function(err) {
                $rootScope.error = "Feeds not found";
            });
      },
      function(err) {
          $rootScope.error = "Users not found";
      });
};