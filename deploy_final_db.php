<?php
$mainSiteFile = '/home/h417440/public_html/data/silveriom_db.json';
$panelFile = '/home/h417440/panel.silveriom.ir/data/silveriom_db.json';

$inputJson = file_get_contents('/home/h417440/public_html/merged_final_db.json');
$data = json_decode($inputJson, true);

if (!$data) {
    die('ERROR: Invalid JSON in merged_final_db.json');
}

$ok1 = file_put_contents($mainSiteFile, $inputJson);
$ok2 = file_put_contents($panelFile, $inputJson);

echo "Main site: " . ($ok1 !== false ? "OK ($ok1 bytes)" : "FAILED") . "\n";
echo "Panel: " . ($ok2 !== false ? "OK ($ok2 bytes)" : "FAILED") . "\n";
echo "mediaInventory count: " . count($data['mediaInventory']) . "\n";
echo "blogs count: " . count($data['blogs'] ?? []) . "\n";
echo "venues count: " . count($data['venues'] ?? []) . "\n";
