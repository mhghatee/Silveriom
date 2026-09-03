<?php
$files = [
    "media-planner/index.html",
    "media-planner.html"
];

$success = 0;
foreach($files as $file) {
    $url = "https://raw.githubusercontent.com/mhghatee/silveriom/main/" . str_replace(" ", "%20", $file);
    
    $content = @file_get_contents($url);
    if($content !== FALSE) {
        file_put_contents($file, $content);
        $success++;
    }
}
echo "SYNC_SUCCESS: $success/" . count($files);
?>
