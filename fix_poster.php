<?php
$files = [
    "about-us/index.html",
    "audience-intelligence/design_proposals.html",
    "audience-intelligence/index.html",
    "audience-intelligence/index_backup.html",
    "bento_extracted.html",
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
    "index.html",
    "loader_concepts.html",
    "media-planner/index.html",
    "mobile_html_debug.html",
    "native_loader.html",
    "panel/admin.html",
    "panel/fetched_login.html",
    "panel/index.html",
    "panel/login.html",
    "panel/original_login_server.html",
    "portfolio/index.html",
    "portfolio/index_clean.html",
    "shared_components/global_css.html",
    "shared_components/header.html",
    "tournament-calendar/index.html"
];

$success = 0;
foreach($files as $file) {
    if(!file_exists($file)) continue;
    $content = file_get_contents($file);
    
    // Add poster attribute
    $modified = str_replace('<video autoplay loop muted playsinline preload="auto">', '<video autoplay loop muted playsinline preload="auto" poster="/loading_poster.png">', $content);
    
    if($content !== $modified) {
        file_put_contents($file, $modified);
        $success++;
    }
}
echo "FIXED_POSTERS: $success\n";
?>
