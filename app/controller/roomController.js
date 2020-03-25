app.controller('roomController', function($scope, $location, $http, playerService) {
    _this = this;
    $scope.isCreateRoom = false; //เช็คว่าสร้างหน้างไหม
    this.modelRoom = {
        name: null,
        number: null,
        numberArr: [],
        bet: null,
        password: null,
        id_player: playerService.getId()
    }

    this.init = function() {
        getRoom();
    }


    /** กดสร้างห้อง */
    this.createRoom = () => {
        $scope.isCreateRoom = true
    }

    /** Save สร้างห้อง */
    this.submiteRoom = () => {
        if (this.modelRoom.name && this.modelRoom.number && this.modelRoom.bet) {
            this.modelRoom.password = (this.modelRoom.password) ? md5(this.modelRoom.password) : null
            let arr = []
            for (let i = 1; i <= this.modelRoom.number; i++) {
                this.modelRoom.numberArr.push(i)
            }
            console.log("this.modelRoom", this.modelRoom);

            loading.open();
            $http.post(webConfig.webApi + "room/createRoomService.php", this.modelRoom).then((res) => {
                // console.log("res.data", res.data);
                loading.close();
                if (res.data.status == "200") {
                    $scope.isCreateRoom = false;
                } else if (res.data.status == "404") {
                    alert("Error")
                }
                this.modelRoom.password = null;
            }).catch((err) => {
                alert("Error")
                loading.close();
                this.modelRoom.password = null;
            })
        } else {
            alert("กรอกข้อมมูลให้ครบ")
        }
    }



    /** รายชื่อห้อง */
    const getRoom = () => {
        const result = (res) => {
            res.filter(e => {
                e.number = JSON.parse(e.number)
                e.numberLength = e.number.length
            });
            // console.log("res", res);
            $scope.room = res
        }
        $http.get(webConfig.webApi + "room/getRoomService.php").then((res) => {
            result(res.data)
        })

        setInterval(function() {
            $http.get(webConfig.webApi + "room/getRoomService.php").then((res) => {
                result(res.data)
            })
        }, 1500);
    }
});