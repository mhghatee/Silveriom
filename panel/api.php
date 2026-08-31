<?php
header('Content-Type: application/json');

$dbFile = '../data/silveriom_db.json';

// Ensure data directory exists
if (!is_dir('../data')) {
    mkdir('../data', 0777, true);
}

// Ensure db file exists
if (!file_exists($dbFile)) {
    file_put_contents($dbFile, json_encode([
        'settings' => new stdClass(), 'aboutUs' => new stdClass(), 'metrics' => [], 
        'venues' => [], 'mediaInventory' => [], 'portfolio' => [], 
        'inquiries' => [], 'users' => [], 'audience' => new stdClass()
    ]));
}

$action = $_GET['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'load') {
    echo file_get_contents($dbFile);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);
    
    if (isset($input['action']) && $input['action'] === 'save_all') {
        if (isset($input['state'])) {
            file_put_contents($dbFile, json_encode($input['state'], JSON_UNESCAPED_UNICODE));
            echo json_encode(['success' => true]);
            exit;
        }
    }
}

echo json_encode(['success' => false, 'error' => 'Invalid request']);
