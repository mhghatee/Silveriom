<?php
// Deploy: Navigation Fix - all pages from commit a6f28f7
// Pulls all changed files from GitHub raw content

$files = [
    "assets/css/global-nav.css",
    "index.html",
    "about-us/index.html",
    "audience-intelligence/index.html",
    "blog/index.html",
    "blog/post.html",
    "club/inventory/index.html",
    "clubs/arena.html",
    "clubs/asayesh.html",
    "clubs/iran-zamin.html",
    "clubs/kish.html",
    "clubs/netra.html",
    "clubs/t10.html",
    "contact-us/index.html",
    "media-planner/index.html",
    "mediakit/index.html",
    "portfolio/index.html",
    "proposal/index.html",
    "tournament-calendar/index.html",
];

$success = 0;
$failed = [];
$base = "https://raw.githubusercontent.com/mhghatee/Silveriom/main/";

foreach($files as $file) {
    $url = $base . str_replace(" ", "%20", $file) . "?nocache=" . time() . rand(1,9999);

    $dir = dirname($file);
    if ($dir != "." && !is_dir($dir)) {
        mkdir($dir, 0777, true);
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    $content = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($content !== FALSE && $httpcode == 200) {
        file_put_contents($file, $content);
        $success++;
        echo "OK: $file\n";
    } else {
        $failed[] = "$file (HTTP $httpcode)";
        echo "FAIL: $file (HTTP $httpcode)\n";
    }
}

echo "\n=== RESULT: $success/" . count($files) . " synced ===\n";
if (!empty($failed)) {
    echo "FAILED:\n" . implode("\n", $failed) . "\n";
}
?>
