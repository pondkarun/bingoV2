﻿app.config(function($routeProvider, $locationProvider) {
    // $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: './app/view/login.html',
            controller: 'loginController'
        })
        .when('/register', {
            templateUrl: './app/view/register.html',
            controller: 'registerController'
        })
        .when('/login', {
            templateUrl: './app/view/login.html',
            controller: 'loginController'
        })
        .when('/room', {
            templateUrl: './app/view/room.html',
            controller: 'roomController',
            resolve: {
                factory: checkPermisstion
            }
        })
        .when('/playroom/:id', {
            templateUrl: './app/view/playroom.html',
            controller: 'playroomController',
            resolve: {
                factory: checkPermisstion
            }
        })

    .otherwise({
        redirectTo: '/room'
    });

});
var checkPermisstion = function($q, $location, $timeout) {
    var per = sessionStorage.getItem("player")
    var deferred = $q.defer();
    if (per) {
        deferred.resolve(true);
    } else {
        deferred.reject();
        $location.path("/login");
    }
    return deferred.promise;
}