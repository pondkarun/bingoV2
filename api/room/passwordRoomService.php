<?php

require_once '../condb.php';
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
$input = file_get_contents('php://input');
$postRequest = json_decode($input);

$id = @$postRequest->id;
$password = @$condb->real_escape_string($postRequest->password);

$sql = "SELECT * FROM room WHERE id = '".$id."' AND password = '".$password."' ";
$result = $condb->query($sql);

if (mysqli_num_rows($result) == 1) {
    $response['status'] = true;
} else {
    $response['status'] = false;
}

echo json_encode($response);
