<?php

require_once '../condb.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
$input = file_get_contents('php://input');
$postRequest = json_decode($input);

$id_player = @$postRequest->id_player;

$sql = "SELECT id_room FROM player_room WHERE id_player = '".$id_player."' ";
$result = $condb->query($sql);

if (mysqli_num_rows($result) == 1) {
    $row = mysqli_fetch_array($result);
    $response['id_room'] = $row['id_room'];
    $response['status'] = true;
} else {
    $response['status'] = false;
}

echo json_encode($response);
