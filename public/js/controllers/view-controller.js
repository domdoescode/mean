function ViewCtrl($rootScope, $scope, $location, Auth, Views) {


    Views.getAll(function(res) {
        console.log('herer',res);
         $scope.views = res

    },
    function(err) {
      $rootScope.error = "Failed to login";
    });

};