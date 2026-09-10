<?php
header('Content-Type: application/json');
$dbFile = '../data/silveriom_db.json';
if (!is_dir('../data')) { mkdir('../data', 0755, true); }
if (!file_exists($dbFile)) { file_put_contents($dbFile, json_encode([])); }

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'load') {
    echo file_get_contents($dbFile);
    exit;
}
