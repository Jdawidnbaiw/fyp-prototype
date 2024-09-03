<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "secret_pocket";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set character set to utf8mb4 for better security and compatibility
$conn->set_charset("utf8mb4");

// Error handling
function handle_error($error) {
    error_log($error);
    header("../error.html");
    exit;
}

// You can include error logging and handling throughout your PHP files
?>
