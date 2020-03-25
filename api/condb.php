<?php

error_reporting(E_ALL); //ถ้าปิด ใส่ 0

$localhost = '103.22.183.220';
$username_db = 'smomscic_bingoV2';
$password_db = 'ztFRzlF2';
$db_name = 'smomscic_bingoV2';

$condb = new mysqli($localhost, $username_db, $password_db, $db_name);
$condb->set_charset('utf8');
date_default_timezone_set('Asia/Bangkok');

if ($condb->connect_errno) {
    echo 'Error : '.$condb->connect_error;
    exit();
}

require_once 'function.php';
