<?php
session_start();
include 'config.php';

$stmt = $conn->prepare("SELECT id, name, description FROM communities");
$stmt->execute();
$result = $stmt->get_result();

$communities = [];
while ($row = $result->fetch_assoc()) {
    $communities[] = $row;
}

echo json_encode($communities);
?>
