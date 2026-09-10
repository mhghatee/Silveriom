<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$uploadDir = '/home/h417440/public_html/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $file = $_FILES['image'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    // Basic security check
    $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'heic', 'heif', 'bmp'];
    if (!in_array($ext, $allowed)) {
        echo json_encode(['success' => false, 'error' => 'پسوند فایل مجاز نیست']);
        exit;
    }

    $filename = uniqid('img_') . '.' . $ext;
    $dest = $uploadDir . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $dest)) {
        // Return the absolute URL of the uploaded image
        $url = 'https://silveriom.ir/uploads/' . $filename;
        echo json_encode(['success' => true, 'url' => $url]);
        exit;
    }
}

echo json_encode(['success' => false, 'error' => 'خطا در آپلود فایل']);
