<?php
$files = [
    "assets/blog_1.jpg",
    "assets/blog_2.jpg",
    "assets/blog_3.jpg",
    "assets/blog_4.jpg",
    "assets/blog_5.jpg",
    "assets/sunstar-preview.jpg",
    "assets/sunstar.png",
    "assets/pmn.png",
    "assets/st-1.jpg",
    "assets/st-2.jpg"
];

$success = 0;
foreach($files as $file) {
    $url = "https://raw.githubusercontent.com/mhghatee/silveriom/main/" . str_replace(" ", "%20", $file);
    
    // Create directory if it doesn't exist (not needed if assets exists, but good practice)
    $dir = dirname($file);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    
    $content = @file_get_contents($url);
    if($content !== FALSE) {
        file_put_contents($file, $content);
        $success++;
    }
}
echo "ASSETS_SYNCED: $success/" . count($files);
?>
