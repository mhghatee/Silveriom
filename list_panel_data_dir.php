<?php
$dir = __DIR__ . '/../panel.silveriom.ir/data';
if (is_dir($dir)) {
    $files = scandir($dir);
    foreach ($files as $f) {
        if ($f != '.' && $f != '..') {
            echo $f . " - " . filesize($dir . '/' . $f) . " bytes - " . date("Y-m-d H:i:s", filemtime($dir . '/' . $f)) . "\n";
        }
    }
} else {
    echo "NO DIRECTORY: " . $dir;
}
