<?php
$files = glob('/home/h417440/public_html/*.html');
foreach($files as $f) {
    if(strpos(file_get_contents($f), 'id="progress"') !== false) {
        echo $f . "\n";
    }
}
