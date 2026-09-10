<?php
$files = ["media_1788534296_881.webp","media_1788534358_105.webp","media_1788537776_336.webp","media_1788537783_778.webp","media_1788537801_267.webp"];
$out = [];
foreach($files as $f) {
    $p = '/home/h417440/public_html/assets/uploads/' . $f;
    if(file_exists($p)) {
        $out[$f] = filesize($p);
    }
}
echo json_encode($out);
