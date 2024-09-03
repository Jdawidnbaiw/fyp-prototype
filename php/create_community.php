<?php
session_start();
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user_id = $_SESSION['user_id']; // Ensure the user is logged in
    $name = htmlspecialchars($_POST['name'], ENT_QUOTES, 'UTF-8');
    $description = htmlspecialchars($_POST['description'], ENT_QUOTES, 'UTF-8');
    $category = htmlspecialchars($_POST['category'], ENT_QUOTES, 'UTF-8');
    $visibility = $_POST['visibility'];

    // Prepare and execute the SQL statement
    $stmt = $conn->prepare("INSERT INTO communities (name, description, category, created_by, visibility) VALUES (?, ?, ?, ?, ?)");
    if (!$stmt) {
        echo json_encode(['error' => 'Prepare failed: ' . $conn->error]);
        exit;
    }

    $stmt->bind_param("sssii", $name, $description, $category, $user_id, $visibility);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Execute failed: ' . $stmt->error]);
    }
    exit;
}
?>
