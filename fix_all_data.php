<?php
// Read the backup we fetched that has 33 items + venues from the old bak file
$backupFile = '/home/h417440/public_html/data/silveriom_db.json.bak_1788967055';
// Read the current main site DB (has 33 items already from our previous restore)
$mainSiteFile = '/home/h417440/public_html/data/silveriom_db.json';
$panelFile = '/home/h417440/panel.silveriom.ir/data/silveriom_db.json';

$backup = json_decode(file_get_contents($backupFile), true);
$main = json_decode(file_get_contents($mainSiteFile), true);

// Show current state
echo "Backup mediaInventory: " . count($backup['mediaInventory'] ?? []) . "\n";
echo "Main mediaInventory: " . count($main['mediaInventory'] ?? []) . "\n";
echo "Backup keys: " . implode(', ', array_keys($backup)) . "\n";
echo "Main keys: " . implode(', ', array_keys($main)) . "\n";
