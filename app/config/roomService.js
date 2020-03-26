app.service('roomService', function() {

    this.saveData = function(data) {
        sessionStorage.setItem("room", JSON.stringify({
            id_room: data.id_room,
        }));
    };

    this.getIdRoom = function() {
        var data = JSON.parse(sessionStorage.getItem('player'));
        return data.id;
    };

})