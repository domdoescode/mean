'use strict';


function HomeCtrl($scope, $routeParams, $rootScope, $http, Auth, $location, Users) {


  $scope.addHashtagVis = true
  $scope.sideBar = true;
  $scope.approved = true;
  $scope.skip = 0;
  $scope.approval = "Open"
  $scope.view = "Pending"

  if ($routeParams.id === undefined ){
    $http.get('/api/feeds?userId='+Auth.user._id).
      success(function(data, status, headers, config) {
      if ( data.feeds && data.feeds.length > 0){
        $scope.feed = data.feeds[data.feeds.length - 1]
        $scope.approved = !$scope.open

        $http.get('/api/feeds/'+$scope.feed._id).
          success(function(data, status, headers, config) {
          if (data.photos.length > 0){
            $scope.latestPhotoDate = data.feed.latestPhotoDate
            $scope.photos = data.photos

            if (data.photos.length < 49 ){
              $scope.hideLoadMore = true
            }
          } else {
            $scope.loopForUpdates();
          }
        });

      }

    });
  } else {
    $http.get('/api/feeds/'+ $routeParams.id).
      success(function(data, status, headers, config) {
      if ( data.feed ){
        $scope.feed = data.feed
        $http.get('/api/photos/'+$scope.feed._id).
          success(function(data, status, headers, config) {
          $scope.photos = data.photos
        });
      }
    });
  }

  Users.getAll(
    function(res) {
        $scope.users = res.users
    },
    function(err) {
        $rootScope.error = "Users not found";
    });



  $scope.showSidebar = function () {
    $scope.selected = !$scope.selected;
  };

  $scope.addHashtagSubmit = function () {
    $scope.feed.hashtags.push($scope.hashtag)

    $http.put('/api/feeds', $scope.feed).
      success(function(data, status, headers, config) {
      $scope.feed = data.feed;
      $scope.addHashtagVis = true

    });
  };

  $scope.adddHashtag = function () {
    $scope.addHashtagVis = false
  };



}


