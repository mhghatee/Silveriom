<?php
// Function to get all html files recursively from github is hard, 
// so we'll just hardcode the modified files based on git status.
$files = [
    "about-us/index.html",
    "audience-intelligence/index.html",
    "audience-intelligence/index_backup.html",
    "blog/index.html",
    "blog/post-1.html",
    "blog/post-2.html",
    "blog/post-3.html",
    "blog/post-4.html",
    "blog/post-5.html",
    "blog/post.html",
    "club-arena.html",
    "club-asayesh.html",
    "club-iran-zamin.html",
    "club-netra.html",
    "club-t10.html",
    "club/inventory/index.html",
    "contact-us/index.html",
    "homepage.html",
    "index.html",
    "inventory/index.html",
    "live_about_us.html",
    "media-planner.html",
    "media-planner/index.html",
    "panel/fetched_login.html",
    "portfolio/index.html",
    "portfolio/index_clean.html",
    "tournament-calendar/index.html"
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
