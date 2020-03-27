app.factory('outService', function($http, $location) {
    var outFactory = {};

    /** logout */
    var _logout = function(data) {
        $http.post(webConfig.webApi + "out/outService.php", data).then((res) => {
            // console.log("res.data", res.data);
            sessionStorage.removeItem("player");
            $location.path("/login");
        })
    };



    outFactory.logout = _logout;
    return outFactory;
});