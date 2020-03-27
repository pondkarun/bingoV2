'use strict';
app.controller('navbarController', function($scope, outService, playerService) {

    this.init = function() {}

    this.logout = () => {
        let model = {
            id_player: playerService.getId()
        }
        console.log(model);
        outService.logout(model)
    }


});

app.directive('navbar', function() {

    return {
        restrict: "E",
        templateUrl: "./app/directive/navbar/template/navbar.html",
        controllerAs: 'navbarController',
        link: function($scope, $element, $attr) {}
    }
});