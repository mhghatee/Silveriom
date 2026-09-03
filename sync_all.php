<?php
$files = [
    "mobile_html_debug.html",
    "loader_concepts.html",
    "index.html",
    "homepage.html",
    "media-planner.html",
    "native_loader.html",
    "live_about_us.html",
    "extracted_footer.html",
    "extracted_header.html",
    "club-t10.html",
    "club-asayesh.html",
    "club-netra.html",
    "club-iran-zamin.html",
    "bento_extracted.html",
    "club-arena.html",
    "club/inventory/index.html",
    "panel/index.html",
    "panel/admin.html",
    "panel/original_login_server.html",
    "panel/fetched_login.html",
    "panel/login.html",
    "about-us/index.html",
    "blog/post.html",
    "blog/post-3.html",
    "blog/index.html",
    "blog/post-2.html",
    "blog/post-5.html",
    "blog/post-4.html",
    "blog/post-1.html",
    "media-planner/index.html",
    "inventory/index.html",
    "shared_components/bg_system.html",
    "shared_components/global_css.html",
    "shared_components/mobile_menu.html",
    "shared_components/scripts.html",
    "shared_components/footer.html",
    "shared_components/top_bar.html",
    "shared_components/header.html",
    "contact-us/index.html",
    "portfolio/index.html",
    "portfolio/index_clean.html",
    "audience-intelligence/index_backup.html",
    "audience-intelligence/index.html",
    "audience-intelligence/design_proposals.html",
    "tournament-calendar/index.html",
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
