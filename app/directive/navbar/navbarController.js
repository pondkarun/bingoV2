'use strict';
app.controller('navbarController', function($scope, outService, playerService, $http) {

    $scope.Score = 0;
    this.model = {
        id_player: playerService.getId()
    };

    this.init = () => {
        this.getScore();

    }

    //** ออกจากระบบ */
    this.logout = () => {
        outService.logout(this.model)
    }

    //** GET คะแนน */
    this.getScore = () => {
        $http.post(webConfig.webApi + "player/getScoreService.php", this.model).then((res) => {
            // console.log("res.data", res.data);
            $scope.Score = Number(res.data.score)
        })

        // setInterval(() => {
        //     $http.post(webConfig.webApi + "player/getScoreService.php", this.model).then((res) => {
        //         $scope.Score = Number(res.data.score)
        //     })
        // }, 3000);
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