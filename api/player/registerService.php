<?php

require_once '../condb.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');

$input = file_get_contents('php://input');
$postRequest = json_decode($input);

$username = @$postRequest->username;
$password = @$postRequest->password;
$name = @$postRequest->name;

$resultObj = new \stdClass();
if ($username) {
    $sql = "SELECT COUNT(id) AS chkUser  FROM player WHERE username = '".$username."' ";
    $result = mysqli_query($condb, $sql);
    $row = mysqli_fetch_array($result);
    $chkUser = $row['chkUser'];
    if ($chkUser == 0) {
        $sql = "INSERT INTO player ( `username` , `password` , `name` ) VALUES ( '".$username."' , '".$password."' , '".$name."')";
        $result = mysqli_query($condb, $sql);
        $last_id = mysqli_insert_id($condb); // คืนค่า id ที่ insert ล่าสุด
        $resultObj->status = '200';
        $resultObj->id_player = $last_id;
        print_r(json_encode($resultObj));
    } else {
        $resultObj->status = '404';
        $resultObj->id_player = null;
        print_r(json_encode($resultObj));
    }
} else {
    $resultObj->status = '500';
    $resultObj->id_player = null;
    print_r(json_encode($resultObj));
}
