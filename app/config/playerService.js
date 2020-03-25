app.service('playerService', function() {
    this.saveData = function(data) {
        sessionStorage.setItem("player", JSON.stringify({
            id: data.id,
            username: data.username,
            name: data.name
        }));
    };



    this.getId = function() {
        var data = JSON.parse(sessionStorage.getItem('player'));
        return data.id;
    };

    this.getUsername = function() {
        var data = JSON.parse(sessionStorage.getItem('player'));
        return data.username;
    };

    this.getName = function() {
        var data = JSON.parse(sessionStorage.getItem('player'));
        return data.name;
    };

})