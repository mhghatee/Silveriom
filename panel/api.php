<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Panel DB (on panel.silveriom.ir)
$dbFile = '/home/h417440/panel.silveriom.ir/data/silveriom_db.json';

// Main site DB (on silveriom.ir) - must stay in sync
$mainSiteDbFile = '/home/h417440/public_html/data/silveriom_db.json';

// Ensure data directories exist
foreach ([$dbFile, $mainSiteDbFile] as $f) {
    $dir = dirname($f);
    if (!is_dir($dir)) mkdir($dir, 0777, true);
}

// Bootstrap empty DB if neither exists
if (!file_exists($dbFile) && !file_exists($mainSiteDbFile)) {
    $emptyDb = json_encode([
        'settings' => new stdClass(), 'aboutUs' => new stdClass(), 'metrics' => [],
        'venues' => [], 'mediaInventory' => [], 'portfolio' => [],
        'inquiries' => [], 'users' => [], 'audience' => new stdClass()
    ], JSON_UNESCAPED_UNICODE);
    file_put_contents($dbFile, $emptyDb);
    file_put_contents($mainSiteDbFile, $emptyDb);
}

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'load') {
    // Always load from main site DB (single source of truth)
    if (file_exists($mainSiteDbFile)) {
        echo file_get_contents($mainSiteDbFile);
    } elseif (file_exists($dbFile)) {
        echo file_get_contents($dbFile);
    } else {
        echo json_encode(['mediaInventory' => []]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    if (isset($input['action']) && $input['action'] === 'save_all') {
        if (isset($input['state'])) {
            $jsonData = json_encode($input['state'], JSON_UNESCAPED_UNICODE);

            // Write to BOTH files simultaneously
            $ok1 = file_put_contents($mainSiteDbFile, $jsonData);
            $ok2 = file_put_contents($dbFile, $jsonData);

            if ($ok1 !== false) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Could not write to main site DB. ok1=' . var_export($ok1,true) . ' ok2=' . var_export($ok2,true)]);
            }
            exit;
        }
    }
}

echo json_encode(['success' => false, 'error' => 'Invalid request']);
