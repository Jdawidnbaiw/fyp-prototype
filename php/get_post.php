<?php
session_start();
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['post_id'])) {
    $post_id = $_GET['post_id'];
    
    $stmt = $conn->prepare("SELECT title, content FROM posts WHERE id = ?");
    $stmt->bind_param("i", $post_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $post = $result->fetch_assoc();

    echo json_encode($post);
    exit;
}
?>
