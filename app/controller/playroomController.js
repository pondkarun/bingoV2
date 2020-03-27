app.controller('playroomController', function($scope, $location, $http, playerService, $routeParams) {
    var _this = this;
    $scope.ReadyRoom = true;
    $scope.myTable = [];
    this.Listplayer = [1, 2];
    this.init = () => {
        this.getListplayer()
    }

    /** รายการผู้เล่น */
    this.getListplayer = () => {
        let model = {
            id_room: $routeParams.id
        }
        $http.post(webConfig.webApi + "playerRoom/getListplayerService.php", model).then((res) => {
            // console.log("res.data", res.data);
            this.Listplayer = res.data;
        })
    }

});