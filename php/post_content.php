<?php
session_start();
include 'config.php';

$user_id = $_SESSION['user_id']; // Ensure the user is logged in

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $title = htmlspecialchars($_POST['title'], ENT_QUOTES, 'UTF-8');
    $content = htmlspecialchars($_POST['content'], ENT_QUOTES, 'UTF-8');
    $community_id = $_POST['community_id'];

    // Prepare and execute the SQL statement
    $stmt = $conn->prepare("INSERT INTO posts (user_id, community_id, title, content) VALUES (?, ?, ?, ?)");
    if (!$stmt) {
        echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param("iiss", $user_id, $community_id, $title, $content);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Execute failed: ' . $stmt->error]);
    }
    exit;
}
?>
