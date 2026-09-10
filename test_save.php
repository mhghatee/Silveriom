<?php
$dbFile = '/home/h417440/public_html/data/silveriom_db.json';
$content = file_get_contents($dbFile);
echo substr($content, 0, 100);
$res = file_put_contents($dbFile, $content);
echo "\nSaved bytes: " . $res;
