<?php
$files = glob('tournament-calendar/*');
foreach($files as $f) {
    echo $f . " (" . filesize($f) . " bytes) - " . date("Y-m-d H:i:s", filemtime($f)) . "\n";
}
echo "\nChecking for .bak files in root and tournament-calendar:\n";
$baks = array_merge(glob('*.bak'), glob('tournament-calendar/*.bak'), glob('*_backup*'), glob('tournament-calendar/*_backup*'));
foreach($baks as $f) {
    echo $f . " (" . filesize($f) . " bytes) - " . date("Y-m-d H:i:s", filemtime($f)) . "\n";
}
?>
