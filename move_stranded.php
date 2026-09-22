<?php
$src = '/home/h417440/assets/uploads';
$dest1 = '/home/h417440/public_html/assets/uploads';
$dest2 = '/home/h417440/panel.silveriom.ir/assets/uploads';

if (is_dir($src)) {
    $files = scandir($src);
    foreach ($files as $f) {
        if ($f != '.' && $f != '..') {
            @copy($src . '/' . $f, $dest1 . '/' . $f);
            @copy($src . '/' . $f, $dest2 . '/' . $f);
        }
    }
    echo "MOVED_STRANDED_FILES";
}
