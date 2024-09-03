<?php
session_start();
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['post_id'])) {
    $post_id = $_GET['post_id'];
    
    $stmt = $conn->prepare("SELECT c.content, u.username, c.created_at 
                            FROM comments c 
                            JOIN users u ON c.user_id = u.id 
                            WHERE c.post_id = ? 
                            ORDER BY c.created_at ASC");
    $stmt->bind_param("i", $post_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $comments = [];
    while ($row = $result->fetch_assoc()) {
        $comments[] = $row;
    }

    echo json_encode($comments);
    exit;
}
?>
