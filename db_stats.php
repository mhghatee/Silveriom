<?php
$files = [
    '/home/h417440/public_html/data/silveriom_db.json',
    '/home/h417440/panel.silveriom.ir/data/silveriom_db.json',
    '/home/h417440/public_html/merged_final_db.json',
    '/home/h417440/panel.silveriom.ir/data/silveriom_db.json.bak',
    '/home/h417440/public_html/data/silveriom_db.json.bak'
];

foreach ($files as $f) {
    if (file_exists($f)) {
        echo "$f exists, size: " . filesize($f) . ", modified: " . date("Y-m-d H:i:s", filemtime($f)) . "\n";
    } else {
        echo "$f DOES NOT EXIST\n";
    }
}
?>
