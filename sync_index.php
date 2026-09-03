<?php
$file = "index.html";
$url = "https://raw.githubusercontent.com/mhghatee/silveriom/main/" . str_replace(" ", "%20", $file);

$content = @file_get_contents($url);
if($content !== FALSE) {
    file_put_contents($file, $content);
    echo "SYNC_SUCCESS: 1/1";
} else {
    echo "SYNC_FAILED";
}
?>
