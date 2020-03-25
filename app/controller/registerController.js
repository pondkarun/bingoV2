app.controller('registerController', function($scope, $location, $http, playerService) {

    $scope.send = () => {
        if ($scope.registerForm.$valid) {
            this.model.password = md5(this.model.passwoord);
            // console.log("this.model", this.model);
            loading.open();
            $http.post(webConfig.webApi + "player/registerService.php", this.model).then((res) => {
                // console.log("res.data", res.data);
                loading.close();
                if (res.data.status == "200") {
                    $location.path("/login");
                } else if (res.data.status == "404") {
                    alert("๊Username ซ้ำ")
                }
                this.model.password = null;
            }).catch((err) => {
                alert("Error")
                loading.close();
                this.model.password = null;
            })

        }
    }

});