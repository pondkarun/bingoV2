app.controller('loginController', function($scope, $location, $http, playerService) {

    $scope.send = () => {
        if ($scope.loginForm.$valid) {
            this.model.password = md5(this.model.passwoord);
            loading.open();
            $http.post(webConfig.webApi + "player/loginService.php", this.model).then((res) => {
                console.log("res.data", res.data);
                loading.close();
                if (res.data.status == "200") {
                    playerService.saveData(res.data)
                    $location.path("/room");
                } else {
                    alert("Error")
                }
                this.model.password = null;
            }).catch((err) => {
                alert("Error")
                loading.close();
                this.model.password = null;
            })
        }
    }
    $scope.register = () => {
        $location.path("/register");
    }
});