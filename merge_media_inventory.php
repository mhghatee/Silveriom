<?php
$backupFile = __DIR__ . '/data/silveriom_db.json.bak_1788967055';
$liveDbFile = __DIR__ . '/data/silveriom_db.json';
$panelDbFile = __DIR__ . '/../panel.silveriom.ir/data/silveriom_db.json';

if (file_exists($backupFile) && file_exists($liveDbFile)) {
    // Read the backup (with 33 items)
    $backupData = json_decode(file_get_contents($backupFile), true);
    $mediaInventory = $backupData['mediaInventory'] ?? [];

    // Read the current live DB (with the newly added blogs)
    $liveData = json_decode(file_get_contents($liveDbFile), true);
    
    // Replace the mediaInventory in the live DB with the 33 items from backup
    $liveData['mediaInventory'] = $mediaInventory;

    // Save it back
    $finalJson = json_encode($liveData, JSON_UNESCAPED_UNICODE);
    file_put_contents($liveDbFile, $finalJson);
    file_put_contents($panelDbFile, $finalJson);
    
    echo "SUCCESS_MERGED_" . count($mediaInventory) . "_ITEMS";
} else {
    echo "ERROR_FILES_MISSING";
}
