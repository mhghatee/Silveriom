<?php
header('Content-Type: application/json');

$dbFile = '/home/h417440/public_html/data/silveriom_db.json';
$targetHtml = '/home/h417440/public_html/about-us/index.html';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'load') {
    if (file_exists($dbFile)) {
        echo file_get_contents($dbFile);
    } else {
        echo json_encode(['aboutUs' => []]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);
    
    if (isset($input['aboutUs'])) {
        // Load DB
        $db = [];
        if (file_exists($dbFile)) {
            $db = json_decode(file_get_contents($dbFile), true) ?: [];
        }
        
        // Update aboutUs
        if (!isset($db['aboutUs'])) {
            $db['aboutUs'] = [];
        }
        
        if (isset($input['flush']) && $input['flush'] === true) {
            // Delete all text_ and img_ keys
            foreach(array_keys($db['aboutUs']) as $k) {
                if (strpos($k, 'text_') === 0 || strpos($k, 'img_') === 0) {
                    unset($db['aboutUs'][$k]);
                }
            }
        }
        
        foreach ($input['aboutUs'] as $k => $v) {
            $db['aboutUs'][$k] = $v;
        }
        file_put_contents($dbFile, json_encode($db, JSON_UNESCAPED_UNICODE));
        
        // Rebuild static HTML
        $ab = $db['aboutUs'];
        ob_start();
        include __DIR__ . '/about_us_template.php';
        $html = ob_get_clean();
        
        file_put_contents($targetHtml, $html);
        
        echo json_encode(['success' => true, 'aboutUs' => $ab]);
        exit;
    }
}
echo json_encode(['success' => false, 'error' => 'Invalid request']);
