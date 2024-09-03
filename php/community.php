<?php
session_start();
include 'config.php';

$user_id = $_SESSION['user_id'];

// Handle GET requests (retrieve communities or posts in a community)
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['community_id'])) {
        // Retrieve posts in the community
        $community_id = $_GET['community_id'];
        $stmt = $conn->prepare("SELECT p.title, p.content, u.username, p.created_at FROM posts p JOIN users u ON p.user_id = u.id WHERE p.community_id = ?");
        $stmt->bind_param("i", $community_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $posts = [];
        while ($row = $result->fetch_assoc()) {
            $posts[] = $row;
        }

        echo json_encode($posts);
        exit;
    } else {
        // Retrieve all communities
        $stmt = $conn->prepare("SELECT id, name, description FROM communities");
        $stmt->execute();
        $result = $stmt->get_result();

        $communities = [];
        while ($row = $result->fetch_assoc()) {
            $communities[] = $row;
        }

        echo json_encode($communities);
        exit;
    }
}

// Handle POST requests (join a community)
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['id'])) {
    $community_id = $_GET['id'];

    $stmt = $conn->prepare("INSERT INTO community_members (user_id, community_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $user_id, $community_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to join community']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $user_id = $_SESSION['user_id']; // Assuming the user is logged in
    $name = htmlspecialchars($_POST['name'], ENT_QUOTES, 'UTF-8');
    $description = htmlspecialchars($_POST['description'], ENT_QUOTES, 'UTF-8');
    $visibility = $_POST['visibility'];

    // Prepare and execute the SQL statement
    $stmt = $conn->prepare("INSERT INTO communities (name, description, created_by, visibility) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssis", $name, $description, $user_id, $visibility);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create community']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['community_id'])) {
    $community_id = $_GET['community_id'];
    
    $stmt = $conn->prepare("SELECT p.title, p.content, u.username, p.created_at FROM posts p JOIN users u ON p.user_id = u.id WHERE p.community_id = ?");
    $stmt->bind_param("i", $community_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $posts = [];
    while ($row = $result->fetch_assoc()) {
        $posts[] = $row;
    }

    echo json_encode($posts);
    exit;
}

// Fetch communities, optionally filtering by category
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $query = "SELECT id, name, description, category FROM communities";
    $params = [];

    if (isset($_GET['category']) && !empty($_GET['category'])) {
        $category = $_GET['category'];
        $query .= " WHERE category = ?";
        $params[] = $category;
    }

    $stmt = $conn->prepare($query);
    if (!empty($params)) {
        $stmt->bind_param("s", ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();

    $communities = [];
    while ($row = $result->fetch_assoc()) {
        $communities[] = $row;
    }

    echo json_encode($communities);
    exit;
}
?>