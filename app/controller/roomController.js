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
        selectRoomMe()
    }


    /** เลือกห้อง */
    this.selectRoom = (index, id) => {
        if ($scope.room[index].password) {
            let person = window.prompt("Password Room", "");
            if (person) {
                let md5Person = md5(person);
                let model = {
                    id: id,
                    password: md5Person
                }
                $http.post(webConfig.webApi + "room/passwordRoomService.php", model).then((res) => {
                    // console.log("res.data", typeof res.data.status);
                    if (res.data.status) {
                        goRoom(id);
                    } else {
                        alert("รหัสเข้าห้องไม่ถูกต้อง")
                    }
                }).catch((err) => {
                    alert("Error")
                })
            }
        } else {
            goRoom(id);
        }
    }

    /** เข้าห้อง */
    const goRoom = (id) => {
        // console.log("Room id", id);
        let model = {
            id_room: id,
            id_player: playerService.getId()
        }

        $http.post(webConfig.webApi + "room/playRoomService.php", model)
        locationPlayroom(id)
    }

    /** path playroom*/
    const locationPlayroom = (id) => {
        $location.path("/playroom/" + id);
    }

    /** cancel สร้างห้อง */
    this.cancelRoom = (model) => {
        $scope.isCreateRoom = false;
    }

    /** กดสร้างห้อง */
    this.createRoom = () => {
        $scope.isCreateRoom = true
    }

    /** Save สร้างห้อง */
    this.submiteRoom = () => {
        if (this.modelRoom.name && this.modelRoom.bet) {
            this.modelRoom.password = (this.modelRoom.password) ? md5(this.modelRoom.password) : null
            loading.open();
            $http.post(webConfig.webApi + "room/createRoomService.php", this.modelRoom).then((res) => {
                // console.log("res.data", res.data);
                loading.close();
                if (res.data.status == "200") {
                    $scope.isCreateRoom = false;
                    goRoom(res.data.id_room)
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
                e.password = (e.password) ? true : false;
            })
            $scope.room = res
        }
        $http.get(webConfig.webApi + "room/getRoomService.php").then((res) => {
            result(res.data)
        })

        setInterval(function() {
            $http.get(webConfig.webApi + "room/getRoomService.php").then((res) => {
                result(res.data)
            })
        }, 150000);
    }

    /** หาห้องที่เคยเข้า */
    const selectRoomMe = () => {
        $http.post(webConfig.webApi + "room/selectRoomMeService.php", this.modelRoom).then((res) => {
            console.log("res.data", res.data);
            if (res.data.status) {
                locationPlayroom(res.data.id_room)
            } else {
                getRoom();
            }
        })
    }
});