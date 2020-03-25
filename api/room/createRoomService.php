<?php

require_once '../condb.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');

$input = file_get_contents('php://input');
$postRequest = json_decode($input);

$name = @$postRequest->name;
$number = @$postRequest->numberArr;
$id_player = @$postRequest->id_player;
$bet = @$postRequest->bet;
$password = @$postRequest->password;
$resultObj = new \stdClass();
if ($name) {
    $number = json_encode($number);

    $sql = "INSERT INTO room 
    ( 
        `name`,
        `number`,
        `id_player`,
        `bet`,
        `password` 
    ) 
    VALUES 
    ( 
        '".$name."',
        '".$number."' ,
        '".$id_player."',
        '".$bet."',
        '".$password."'
    )";
    $result = mysqli_query($condb, $sql);
    $resultObj->status = '200';
    print_r(json_encode($resultObj));
} else {
    $resultObj->status = '500';
    print_r(json_encode($resultObj));
}
