<?php
// api_profile.php
require_once 'config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) exit;
$user_id = $_SESSION['user_id'];
$action = $_GET['action'] ?? '';

// Load Profile
if ($action === 'load') {
    $stmt = $conn->prepare("SELECT email, display_name, avatar_emoji, profile_photo, created_at FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    echo json_encode($stmt->get_result()->fetch_assoc());
}

// Update Profile & Photo
if ($action === 'update') {
    $displayName = $_POST['displayName'] ?? '';
    $avatar = $_POST['avatar'] ?? '👤';
    $photoURL = $_POST['existingPhoto'] ?? null;

    // Handle File Upload
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === 0) {
        $allowed = ['jpg', 'jpeg', 'png', 'webp'];
        $filename = $_FILES['photo']['name'];
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

        if (in_array($ext, $allowed)) {
            // Create folder if not exists
            if (!is_dir('uploads')) mkdir('uploads', 0777, true);
            
            $newName = "profile_" . $user_id . "_" . time() . "." . $ext;
            $uploadPath = 'uploads/' . $newName;
            
            if (move_uploaded_file($_FILES['photo']['tmp_name'], $uploadPath)) {
                $photoURL = $uploadPath;
            }
        }
    } else if (isset($_POST['removePhoto']) && $_POST['removePhoto'] === 'true') {
        $photoURL = null;
    }

    $stmt = $conn->prepare("UPDATE users SET display_name = ?, avatar_emoji = ?, profile_photo = ? WHERE id = ?");
    $stmt->bind_param("sssi", $displayName, $avatar, $photoURL, $user_id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'photoURL' => $photoURL]);
    } else {
        echo json_encode(['success' => false]);
    }
}
?>
