<?php
session_start();
include 'config.php';

// Handle GET requests (retrieve affirmations)
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $stmt = $conn->prepare("SELECT content FROM affirmations ORDER BY created_at DESC LIMIT 5");
    $stmt->execute();
    $result = $stmt->get_result();

    $affirmations = [];
    while ($row = $result->fetch_assoc()) {
        $affirmations[] = $row;
    }

    echo json_encode($affirmations);
    exit;
}
?>
