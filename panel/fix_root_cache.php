<?php
$files = glob('/home/h417440/public_html/*.html');
foreach($files as $f) {
    $content = file_get_contents($f);
    if(strpos($content, 'client_sync.js') !== false) {
        $content = preg_replace('/client_sync\.js\?v=\d+/', 'client_sync.js?v=' . time(), $content);
        $content = preg_replace('/client_sync\.js"/', 'client_sync.js?v=' . time() . '"', $content);
        file_put_contents($f, $content);
        echo "Updated $f\n";
    }
}
