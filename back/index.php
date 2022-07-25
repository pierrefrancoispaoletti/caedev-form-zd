<?php

$user = (object) [
    "id" => "1",
    "firstname" => "pef",
    "lastname" => "paoletti",
];



$encodedUser = json_encode($user);
echo "<script type='text/javascript'> user = {$encodedUser} </script>";
require __DIR__ . '/react/index.html';
