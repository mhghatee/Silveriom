<?php
$source = __DIR__ . '/panel';
$dest = __DIR__ . '/../panel.silveriom.ir';

function recurse_copy($src,$dst) {
    $dir = opendir($src);
    @mkdir($dst);
    while(false !== ( $file = readdir($dir)) ) {
        if (( $file != '.' ) && ( $file != '..' )) {
            if ( is_dir($src . '/' . $file) ) {
                recurse_copy($src . '/' . $file,$dst . '/' . $file);
            }
            else {
                copy($src . '/' . $file,$dst . '/' . $file);
            }
        }
    }
    closedir($dir);
}

if (is_dir($source) && is_dir($dest)) {
    recurse_copy($source, $dest);
    echo "SUCCESS_COPIED";
} else {
    echo "ERROR_DIRS_NOT_FOUND";
}
