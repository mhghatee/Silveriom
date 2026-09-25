<?php
// Backdoor sync for emergencies
if (isset($_GET['force_sync_file'])) {
    $file = $_GET['force_sync_file'];
    $url = "https://raw.githubusercontent.com/mhghatee/Silveriom/main/" . str_replace(" ", "%20", $file) . "?nocache=" . time();
    $content = @file_get_contents($url);
    if ($content !== FALSE) {
        $dir = dirname("../" . $file);
        if ($dir != "." && !is_dir($dir)) {
            mkdir($dir, 0777, true);
        }
        file_put_contents("../" . $file, $content);
        echo "SYNCED: " . $file . " (" . strlen($content) . " bytes)\n";
    } else {
        echo "FAILED TO FETCH: " . $url . "\n";
    }
    exit;
}

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || empty($input['cart'])) {
    echo json_encode(['success' => false, 'error' => 'اطلاعات نامعتبر است یا سبد خالی است']);
    exit;
}

$dbFile = '../data/silveriom_db.json';
if (!file_exists($dbFile)) {
     echo json_encode(['success' => false, 'error' => 'دیتابیس یافت نشد']);
     exit;
}

$db = json_decode(file_get_contents($dbFile), true);

$id = 'SILV-' . strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));

$proposal = [
    'id' => $id,
    'name' => $input['name'] ?? '',
    'brand' => $input['brand'] ?? '',
    'phone' => $input['phone'] ?? '',
    'cart' => $input['cart'],
    'created_at' => date('Y-m-d H:i:s')
];

if (!isset($db['inquiries'])) {
    $db['inquiries'] = [];
}

// Add to the beginning of inquiries
array_unshift($db['inquiries'], $proposal);

file_put_contents($dbFile, json_encode($db, JSON_UNESCAPED_UNICODE));

echo json_encode(['success' => true, 'id' => $id]);
?>
