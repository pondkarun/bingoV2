<?php

require_once '../condb.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');

$input = file_get_contents('php://input');
$postRequest = json_decode($input);
$id_room = @$postRequest->id_room;

try {
    $data = array();
    $query = "SELECT 
    pr.id,
    pr.id_player,
    pr.status,
    p.name
    FROM player_room AS pr
    INNER JOIN player AS p ON pr.id_player = p.id 
    WHERE pr.id_room = '".$id_room."' ";
    $result = $condb->query($query) or die($condb->error);
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
} catch (PDOException $e) {
    echo $e->getMessage();
}
