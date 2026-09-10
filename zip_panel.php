<?php
$zip = new ZipArchive();
$filename = "/home/h417440/panel.silveriom.ir/panel_backup.zip";

if ($zip->open($filename, ZipArchive::CREATE)!==TRUE) {
    exit("cannot open <$filename>\n");
}

$dir = '/home/h417440/panel.silveriom.ir/';
$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));

foreach ($iterator as $key=>$value) {
    if (!$value->isDir()) {
        $realPath = $value->getRealPath();
        $relativePath = substr($realPath, strlen($dir));
        // Skip some files
        if (strpos($relativePath, 'panel_backup.zip') !== false) continue;
        if (strpos($relativePath, 'silveriom_db.json') !== false) continue; // Don't overwrite local db with live db necessarily, but wait, sure, we can exclude it or include it. Let's include it.
        $zip->addFile($realPath, $relativePath);
    }
}
$zip->close();
echo "SUCCESS";
