<?php
header('Content-Type: application/json');

// Ensure upload directory exists
$uploadDir = '../assets/uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (isset($input['image_base64'])) {
    $base64 = $input['image_base64'];
    
    // Remove the data URI scheme prefix (e.g., data:image/webp;base64,)
    if (preg_match('/^data:image\/(\w+);base64,/', $base64, $type)) {
        $data = substr($base64, strpos($base64, ',') + 1);
        $type = strtolower($type[1]); // e.g., webp
        
        $data = base64_decode($data);
        if ($data === false) {
            echo json_encode(['success' => false, 'error' => 'Base64 decode failed']);
            exit;
        }
        
        $filename = 'media_' . time() . '_' . rand(100, 999) . '.' . $type;
        $filepath = $uploadDir . $filename;
        
        if (file_put_contents($filepath, $data)) {
            // Return relative path from root
            echo json_encode(['success' => true, 'url' => 'assets/uploads/' . $filename]);
            exit;
        }
    }
}

echo json_encode(['success' => false, 'error' => 'Invalid upload request']);
?>
