<?php

require_once '../condb.php';
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

try {
    $data = array();

    $query = 'SELECT * , (SELECT COUNT(id) FROM `player_room` WHERE id_room = r.id) AS COUNT_PAR FROM `room` AS r ORDER BY r.datetime ASC';
    $result = $condb->query($query) or die($condb->error);

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
} catch (PDOException $e) {
    echo $e->getMessage();
}
