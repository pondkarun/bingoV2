'use strict';
app.controller('navbarController', ['$scope',
    function($scope) {

        this.init = function() {

        }


    }
]);

app.directive('navbar', function() {

    return {
        restrict: "E",
        templateUrl: "./app/directive/navbar/template/navbar.html",
        controllerAs: 'navbarController',
        link: function($scope, $element, $attr) {}
    }
});