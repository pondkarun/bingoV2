app.controller('playroomController', function($scope, $location, $http, roomService, playRoomService, playerService) {

    $scope.numAll = [];
    $scope.randomGame = [];
    $scope.myTable = [];
    $scope.tablenum = [];
    $scope.playerLoad = {
        numPlayer: null,
        readyPlayer: null,
        notReadyPlayer: null
    };
    $scope.is_show = true;
    $scope.model = {
        id_room: roomService.getIdRoom(),
        id_player: playerService.getIdPlayer(),
        readyOrNot: null,
        status: null,
        bingo: null,
    };



    this.init = () => {
        getNumberRoom()
    }

    $scope.vote = function() {

        $scope.model.readyOrNot = !$scope.model.readyOrNot
        $scope.model.status = ($scope.model.readyOrNot == true) ? "true" : "false";
        if ($scope.model.readyOrNot) {
            $scope.voteReady = `Ready`;
        } else {
            $scope.voteReady = `Not Ready`
        };
        $http.post(webConfig.webApi + "playerAccRoom/readyOrNotService.php", $scope.model).then((res) => {
            // console.log("res.data", res.data);
        });
        // console.log("numAll", $scope.numAll);
    }

    $scope.random = function() {
        $scope.tablenum = [];
        $scope.myTable = [];
        var nums = angular.copy($scope.numAll);
        var i = nums.length;
        var j = 0;
        var c = 0
        while (i--) {
            // console.log(c);
            if ($scope.tablenum.length < 25) {
                j = Math.floor(Math.random() * (i + 1));
                if (c != 12) {
                    $scope.tablenum.push(nums[j]);
                    nums.splice(j, 1);
                } else {
                    $scope.tablenum.push("Free");
                }
            } else {
                break;
            }
            c++;
        }
        setMyTable($scope.tablenum);
        tableBingo();
        // console.log("tablenum", $scope.tablenum);
        // console.log("myTable", $scope.myTable);
    }

    $scope.select = () => {

        this.modelTable = {
            id_par: roomService.getId(),
            number: $scope.tablenum
        }

        if ($scope.tablenum.length > 0) {
            // console.log("modelTable", this.modelTable);
            loading.open();
            $http.post(webConfig.webApi + "tableNumber/selectTableNumberService.php", this.modelTable).then((res) => {
                // console.log("res.data", res.data);
                res.data.number = JSON.parse(res.data.number)
                playRoomService.saveData(res.data)
                loading.close();
            }).catch((err) => {
                console.log("Error");
                loading.close();
            })
            $scope.is_show = false;
        } else {
            alert("New Random")
            $scope.is_show = true;
        }

    }

    const setMyTable = (k) => {
        $scope.myTable = [
            [{ index: 0, is_find: false, number: k[0] }, { index: 1, is_find: false, number: k[1] }, { index: 2, is_find: false, number: k[2] }, { index: 3, is_find: false, number: k[3] }, { index: 4, is_find: false, number: k[4] }],
            [{ index: 5, is_find: false, number: k[5] }, { index: 6, is_find: false, number: k[6] }, { index: 7, is_find: false, number: k[7] }, { index: 8, is_find: false, number: k[8] }, { index: 9, is_find: false, number: k[9] }],
            [{ index: 10, is_find: false, number: k[10] }, { index: 11, is_find: false, number: k[11] }, { index: 12, is_find: true, number: k[12] }, { index: 13, is_find: false, number: k[13] }, { index: 14, is_find: false, number: k[14] }],
            [{ index: 15, is_find: false, number: k[15] }, { index: 16, is_find: false, number: k[16] }, { index: 17, is_find: false, number: k[17] }, { index: 18, is_find: false, number: k[18] }, { index: 19, is_find: false, number: k[19] }],
            [{ index: 20, is_find: false, number: k[20] }, { index: 21, is_find: false, number: k[21] }, { index: 22, is_find: false, number: k[22] }, { index: 23, is_find: false, number: k[23] }, { index: 24, is_find: false, number: k[24] }],
        ];
    }


    const getNumberRoom = () => {
        let IdRoom = roomService.getIdRoom();
        $http.post(webConfig.webApi + "room/getRoomNumberService.php", IdRoom).then((res) => {
            // console.log("res.data", res.data);
            res.data.number = JSON.parse(res.data.number)
            $scope.numAll = res.data.number

            if (playRoomService.SessionPlayRoom()) {
                if (playRoomService.SessionPlayRoom().id_par == roomService.getId()) {
                    setMyTable(playRoomService.SessionPlayRoom().number);
                    $scope.tablenum = playRoomService.SessionPlayRoom().number
                    $scope.is_show = false;
                }
            }
            getPlayer();
        }).catch((err) => {
            alert("Error")
        })
    }



    const getPlayer = () => {
        let IdRoom = roomService.getIdRoom();
        let log = []
        $http.post(webConfig.webApi + "playerAccRoom/getPlayerAccRoomService.php", IdRoom).then((res) => {
            // console.log("res.data", res.data);
            log = []
            $scope.player = res.data
            $scope.player.forEach(e => {
                if (e.bingo == "true") {
                    log.push(e)
                }
            })
            EndGame(log)
            setPlayerLoad($scope.player);
            setGameBingo()
            getMe();
        })
        $scope.setInterval = setInterval(function() {
            log = []
            $http.post(webConfig.webApi + "playerAccRoom/getPlayerAccRoomService.php", IdRoom).then((res) => {
                // console.log("res.data", res.data);
                $scope.player = res.data
                $scope.player.forEach(e => {
                    if (e.bingo == "true") {
                        log.push(e)
                    }
                })
                EndGame(log)
                setPlayerLoad($scope.player);
                setGameBingo()
                getMe();
            })
        }, 1960);
        //  1960
    }

    const setPlayerLoad = (res) => {
        let countReadyPlayer = angular.copy(res);
        let countNotReadyPlayer = angular.copy(res);
        countReadyPlayer = countReadyPlayer.filter(e => e.status == "true")
        countNotReadyPlayer = countNotReadyPlayer.filter(e => e.status == "false")
        $scope.playerLoad = {
            numPlayer: res.length,
            readyPlayer: countReadyPlayer.length,
            notReadyPlayer: countNotReadyPlayer.length
        };
    }

    /** เมื่อทุกคนพร้อมเกมจะเริ่ม */
    const setGameBingo = () => {
        getRoomGame()
        let playerRoom = $scope.playerLoad;
        // console.log(playerRoom);
        if (playerRoom.numPlayer == playerRoom.readyPlayer) {
            let randomMonth = $scope.numAll[Math.floor(Math.random() * $scope.numAll.length)];
            // console.log("randomMonth", randomMonth);
            setTimeout(function() {
                let modelSave = {
                    id_room: roomService.getIdRoom(),
                    number: randomMonth
                };

                if (Number($scope.player[0].id_player) == playerService.getIdPlayer()) {
                    $http.post(webConfig.webApi + "room/addRoomGameService.php", modelSave).then((res) => {
                        // console.log("res.data", res.data);
                        $scope.model.status = "false"
                    })
                }
            }, 1000)
        }



    }

    /** ดึงข้อมูล สุ่ม bingo */
    const getRoomGame = (id) => {
        let IdRoom = roomService.getIdRoom();
        $http.post(webConfig.webApi + "room/getRoomGameService.php", IdRoom).then((res) => {
            // console.log("res.data555", res.data);
            res.data.filter(e => {
                e.number = Number(e.number)
            })
            $scope.randomGame = res.data;
            tableBingo()
        })
    }

    const tableBingo = () => {
        setMyTable(playRoomService.SessionPlayRoom().number)
            // let random = [24, 5, 9, 56, 78, 66, 33, 41, 30, 4, 21, 71, 50];
        let random = $scope.randomGame;
        let positionIndex = [];
        random.forEach(e => {
            let where = $scope.tablenum.indexOf(e.number)
            if (where != -1) {
                positionIndex.push(where)
            }
        });

        $scope.myTable.forEach(e => {
            positionIndex.forEach(i => {
                var filteredObj = e.find(x => x.index == i)
                if (filteredObj)
                    filteredObj.is_find = true

            })
        })

        // set NumAll ใหม่ ตัดที่ถูกสุ่มไปแล้ว
        setNewNumAll()
    }

    const setNewNumAll = () => {
        let randomGame = []
        let tempNumAll = [];
        $scope.randomGame.forEach(e => randomGame.push(e.number))

        $scope.numAll.forEach(e => {
            let j = randomGame.indexOf(e)
            if (j == -1) {
                tempNumAll.push(e)
            }
        })
        $scope.numAll = tempNumAll
        checkBingo()
    }

    //เช็คว่าบิงโกยัง
    const checkBingo = () => {
        // console.log("myTable", $scope.myTable);
        let myTable = []
        $scope.myTable.forEach(e => {
            e.forEach(x => {
                myTable.push(x)
            })
        });
        // เงื่อนไข
        if (true) {
            // เงื่อนไข คอลัมน์ 
            if (myTable[0].is_find && myTable[1].is_find && myTable[2].is_find && myTable[3].is_find && myTable[4].is_find) {
                $scope.model.bingo = "true"; //คอลัมน์ 1
                Bingo()
            }
            if (myTable[5].is_find && myTable[6].is_find && myTable[7].is_find && myTable[8].is_find && myTable[9].is_find) {
                $scope.model.bingo = "true"; //คอลัมน์ 2
                Bingo()
            }
            if (myTable[10].is_find && myTable[11].is_find && myTable[12].is_find && myTable[13].is_find && myTable[14].is_find) {
                $scope.model.bingo = "true"; //คอลัมน์ 3
                Bingo()
            }
            if (myTable[15].is_find && myTable[16].is_find && myTable[17].is_find && myTable[18].is_find && myTable[19].is_find) {
                $scope.model.bingo = "true"; //คอลัมน์ 4
                Bingo()
            }
            if (myTable[20].is_find && myTable[21].is_find && myTable[22].is_find && myTable[23].is_find && myTable[24].is_find) {
                $scope.model.bingo = "true"; //คอลัมน์ 5
                Bingo()
            }

            // เงื่อนไข แถว 
            if (myTable[0].is_find && myTable[5].is_find && myTable[10].is_find && myTable[15].is_find && myTable[20].is_find) {
                $scope.model.bingo = "true"; //แถว 1
                Bingo()
            }
            if (myTable[1].is_find && myTable[6].is_find && myTable[11].is_find && myTable[16].is_find && myTable[21].is_find) {
                $scope.model.bingo = "true"; //แถว 2
                Bingo()
            }
            if (myTable[2].is_find && myTable[7].is_find && myTable[12].is_find && myTable[17].is_find && myTable[22].is_find) {
                $scope.model.bingo = "true"; //แถว 3
                Bingo()
            }
            if (myTable[3].is_find && myTable[8].is_find && myTable[13].is_find && myTable[18].is_find && myTable[23].is_find) {
                $scope.model.bingo = "true"; //แถว 4
                Bingo()
            }
            if (myTable[4].is_find && myTable[9].is_find && myTable[14].is_find && myTable[19].is_find && myTable[24].is_find) {
                $scope.model.bingo = "true"; //แถว 5
                Bingo()
            }


            // เงื่อนไข 4 มุม 
            if (myTable[0].is_find && myTable[4].is_find && myTable[20].is_find && myTable[24].is_find) {
                $scope.model.bingo = "true"; //4 มุม นอก
                Bingo()
            }
            if (myTable[6].is_find && myTable[8].is_find && myTable[16].is_find && myTable[18].is_find) {
                $scope.model.bingo = "true"; //4 มุม ใน
                Bingo()
            }


        }

    }
    const Bingo = () => {
        // console.log("$scope.model", $scope.model);
        $http.post(webConfig.webApi + "bingo/bingoService.php", $scope.model)
    }

    const EndGame = (data) => {
        if (data.length > 0) {
            clearInterval($scope.setInterval);
            // console.log(data);
            let name = []
            data.forEach(e => {
                name.push(e.user)
            });
            alert("จบเกม " + name + " BINGO");
            let model = {
                id_room: roomService.getIdRoom(),
                id_par: roomService.getId()
            };
            // console.log("model", model);

            $http.post(webConfig.webApi + "bingo/endGameBingoService.php", model);
            sessionStorage.removeItem("room");
            sessionStorage.removeItem("playRoom");
            $location.path("/room");
        }

    }

    const getMe = () => {
        $http.post(webConfig.webApi + "playerAccRoom/getMePARService.php", $scope.model).then((res) => {
            // console.log("res.data", res.data);
            $scope.model.status = res.data.status;
            $scope.model.readyOrNot = (res.data.status == "true") ? true : false;
            if ($scope.model.readyOrNot) {
                $scope.voteReady = `Ready`
            } else {
                $scope.voteReady = `Not Ready`
            };
        });

    }

});