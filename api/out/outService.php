<?php

require_once '../condb.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
$input = file_get_contents('php://input');
$postRequest = json_decode($input);

$id_player = $postRequest->id_player;

if ($id_player) {
    $sql = "DELETE FROM `player_room` WHERE id_player =  '".$id_player."' ";
    $result = mysqli_query($condb, $sql) or die("Error in query: $sql".mysqli_error());
}
