<?php
session_start();
include 'config.php';

$user_id = $_SESSION['user_id'];

// Handle GET requests (retrieve notes)
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $stmt = $conn->prepare("SELECT id, title, content FROM notes WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $notes = [];
    while ($row = $result->fetch_assoc()) {
        $notes[] = $row;
    }

    echo json_encode($notes);
    exit;
}

// Handle POST requests (create a new note)
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $title = $_POST['title'];
    $content = $_POST['content'];

    $stmt = $conn->prepare("INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $user_id, $title, $content);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save note']);
    }
    exit;
}

// Handle DELETE requests (delete a note)
if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    $id = $_GET['id'];

    $stmt = $conn->prepare("DELETE FROM notes WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $id, $user_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete note']);
    }
    exit;
}
?>
