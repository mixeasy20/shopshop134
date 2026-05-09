<?php
// auth_api.php
require_once 'config.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

if ($action === 'register') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'กรุณากรอกข้อมูลให้ครบ']);
        exit;
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $email, $hashed_password);
    
    if ($stmt->execute()) {
        $_SESSION['user_id'] = $stmt->insert_id;
        $_SESSION['email'] = $email;
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'อีเมลนี้ถูกใช้งานแล้ว']);
    }
}

if ($action === 'login') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    $stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($user = $result->fetch_assoc()) {
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['email'] = $email;
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'รหัสผ่านไม่ถูกต้อง']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'ไม่พบอีเมลนี้ในระบบ']);
    }
}

if ($action === 'logout') {
    session_destroy();
    echo json_encode(['success' => true]);
}
?>
