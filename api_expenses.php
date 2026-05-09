<?php
// api_expenses.php
require_once 'config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$user_id = $_SESSION['user_id'];
$action = $_GET['action'] ?? '';

// Get all expenses
if ($action === 'list') {
    $stmt = $conn->prepare("SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC, created_at DESC");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $items = [];
    while ($row = $result->fetch_assoc()) {
        $row['price'] = (float)$row['price'];
        $row['is_favorite'] = (bool)$row['is_favorite'];
        $items[] = $row;
    }
    echo json_encode($items);
}

// Add new expense
if ($action === 'add') {
    $name = $_POST['name'] ?? '';
    $price = $_POST['price'] ?? 0;
    $category = $_POST['category'] ?? 'อื่นๆ';
    $date = $_POST['date'] ?? date('Y-m-d');
    
    $stmt = $conn->prepare("INSERT INTO expenses (user_id, name, price, category, date) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("isdss", $user_id, $name, $price, $category, $date);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'บันทึกไม่สำเร็จ']);
    }
}

// Toggle Favorite
if ($action === 'toggle_fav') {
    $id = $_POST['id'] ?? 0;
    $is_fav = $_POST['is_favorite'] === 'true' ? 1 : 0;
    
    $stmt = $conn->prepare("UPDATE expenses SET is_favorite = ? WHERE id = ? AND user_id = ?");
    $stmt->bind_param("iii", $is_fav, $id, $user_id);
    $stmt->execute();
    echo json_encode(['success' => true]);
}

// Delete item
if ($action === 'delete') {
    $id = $_POST['id'] ?? 0;
    $stmt = $conn->prepare("DELETE FROM expenses WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $id, $user_id);
    $stmt->execute();
    echo json_encode(['success' => true]);
}

// Clear all
if ($action === 'clear_all') {
    $stmt = $conn->prepare("DELETE FROM expenses WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    echo json_encode(['success' => true]);
}
?>
