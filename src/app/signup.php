<?php
// Set empty values.
$first_name = $last_name = $email = "";

// Check input is in post method.
if ($_SERVER["REQUEST_METHOD"] == "POST")
{
    $first_name = test_input($_POST["first_name"]);
    $last_name = test_input($_POST["last_name"]);
    $email = test_input($_POST["email"]);

    console_log($first_name);
    console_log($last_name);
    console_log($email);
}

// Make input safe to use.
function test_input($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function console_log( $data ){
    echo '<script>';
    echo 'console.log('. json_encode( $data ) .')';
    echo '</script>';
}