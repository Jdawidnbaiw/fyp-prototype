<?php
session_start();
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user_id = $_SESSION['user_id']; // Ensure the user is logged in
    $post_id = $_POST['post_id'];
    $content = htmlspecialchars($_POST['content'], ENT_QUOTES, 'UTF-8');

    // Prepare and execute the SQL statement
    $stmt = $conn->prepare("INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)");
    if (!$stmt) {
        echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param("iis", $post_id, $user_id, $content);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'comment_id' => $stmt->insert_id]);
    } else {
        echo json_encode(['error' => 'Execute failed: ' . $stmt->error]);
    }
    exit;
}
