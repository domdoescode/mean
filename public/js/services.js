'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
// angular.module('myApp.services', []).
//   value('version', '0.1');


'use strict';

angular.module('myApp.services', [])
.factory('Auth', function($http, $cookieStore){

    var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles
        , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public }
        , adminUser = false;


        console.log('currentUser', currentUser);
    if (currentUser.role.bitMask === 4){
        adminUser = true;
    }
    $cookieStore.remove('user');
    function changeUser(user) {
        $cookieStore.put('user', user);
        _.extend(currentUser, user);

    };

    return {
        authorize: function(accessLevel, role) {
            if(role === undefined)
                role = currentUser.role;
            console.log(accessLevel);
            return accessLevel.bitMask & role.bitMask;
        },
        isLoggedIn: function(user) {
            if(user === undefined)
                user = currentUser;
                $cookieStore.put('user', user);
            return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title;
        },
        register: function(user, success, error) {
            console.log(user);
            $http.post('/users', user).success(function(res) {
                changeUser(res);
                success();
            }).error(error);
        },
        login: function(user, success, error) {
            $http.post('/auth/log-in', user).success(function(user){
                console.log(user);
                changeUser(user);
                success(user);
            }).error(error);
        },
        logout: function(success, error) {
            $http.get('/auth/log-out').success(function(){
                changeUser({
                    username: '',
                    role: userRoles.public
                });
                success();
            }).error(error);
        },
        isAdminUser: function(user) {
            // if(user === undefined)
            //     user = currentUser;
            console.log('user', currentUser.role);
            if(currentUser !== undefined && currentUser.role.bitMask === 4) {
                return true
            }else {
               return false
            }
            // return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title;
        },
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser,
        adminUser : adminUser
    };
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
    };
})

.factory('Views', function($http) {
    return {
        getAll: function(success, error) {
            $http.get('/api/views').success(success).error(error);
        }
    };
})



