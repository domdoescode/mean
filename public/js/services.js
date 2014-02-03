'use strict';

/* Services */


angular.module('myApp.services', [])

.factory('Auth', function($http, $cookieStore){


  var accessLevels = routingConfig.accessLevels
    , userRoles = routingConfig.userRoles
    , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public }
    , adminUser = false;


  return {

      authorize: function(accessLevel, role) {
        if(role === undefined)
            role = currentUser.role;
        console.log('accessloevel', accessLevel);
        return accessLevel.bitMask & role.bitMask;
      },

      isLoggedIn: function(user) {

        if(user === undefined) {

          user = currentUser
          $cookieStore.put('user', user)
          return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title

        } else {

          return false
        }
      },


      register: function(user, success, error) {
          console.log(user);
        $http.post('/users', user).success(function(res) {
            changeUser(res);
            success();
        }).error(error);
      },


      login: function(user, success, error) {
        console.log(user);
        $http.post('/auth/log-in', user).success(function(user){
          console.log(user);
          changeUser(user)
          success(user)
        }).error(error)
      },


      logout: function(success, error) {
        $http.get('/auth/log-out').success(function(){
          changeUser({
              username: '',
              role: userRoles.public
          })
          success()
        }).error(error)
      },

      isAdminUser: function(user) {

        if(currentUser !== undefined && currentUser.role.bitMask === 4) {
            return true
        }else {
           return false
        }
      },

      accessLevels: accessLevels,
      userRoles: userRoles,
      user: currentUser,
      adminUser : adminUser
  }

  function changeUser(user) {
    $cookieStore.put('user', user);
    _.extend(currentUser, user);

  }
})





.factory('Users', function($http) {
    return {
        getAll: function(success, error) {
            $http.get('/api/users').success(success).error(error);
        },
        getFromId: function(userId, success, error) {
            $http.get('/api/users/'+userId).success(success).error(error);
        },
        getUsersFeeds: function(userId, success, error) {
            $http.get('/api/users/'+userId+'/feeds').success(success).error(error);
        }
    }
})




