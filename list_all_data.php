<?php
$dir = __DIR__ . '/data';
if (is_dir($dir)) {
    $files = scandir($dir);
    foreach ($files as $f) {
        if ($f != '.' && $f != '..') {
            echo $f . " - " . filesize($dir . '/' . $f) . " bytes - " . date("Y-m-d H:i:s", filemtime($dir . '/' . $f)) . "\n";
        }
    }
}
$dir2 = __DIR__ . '/../panel.silveriom.ir/data';
if (is_dir($dir2)) {
    $files = scandir($dir2);
    foreach ($files as $f) {
        if ($f != '.' && $f != '..') {
            echo "PANEL: " . $f . " - " . filesize($dir2 . '/' . $f) . " bytes - " . date("Y-m-d H:i:s", filemtime($dir2 . '/' . $f)) . "\n";
        }
    }
}
