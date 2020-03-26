<?php

require_once '../condb.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');

$input = file_get_contents('php://input');
$postRequest = json_decode($input);

$id_room = @$postRequest->id_room;
$id_player = @$postRequest->id_player;

$resultObj = new \stdClass();

if ($id_room && $id_player) {
    $sql = "INSERT INTO player_room 
    ( 
        `id_player`,
        `id_room`
    ) 
    VALUES 
    ( 
        '".$id_player."',
        '".$id_room."'
    )";
    $result = mysqli_query($condb, $sql);
    $resultObj->status = '200';
    print_r(json_encode($resultObj));
} else {
    $resultObj->status = '500';
    print_r(json_encode($resultObj));
}
