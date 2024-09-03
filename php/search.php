<?php
include 'config.php';

$query = $_GET['query'];
$results = [];

// Search notes
$stmt = $conn->prepare("SELECT title, content FROM notes WHERE title LIKE ? OR content LIKE ?");
$searchTerm = "%{$query}%";
$stmt->bind_param("ss", $searchTerm, $searchTerm);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $results[] = $row;
}

// Output results as JSON
echo json_encode($results);
?>
