<?php
$files = [
    "mobile_html_debug.html",
    "loader_concepts.html",
    "index.html",
    "assets/iran_padel_hud_map_v2.jpg",
    "assets/iran_padel_hud_map_v2.webp",
    "homepage.html",
    "media-planner.html",
    "favicon.png",
    "native_loader.html",
    "live_about_us.html",
    "extracted_footer.html",
    "extracted_header.html",
    "clubs/t10.html",
    "clubs/asayesh.html",
    "clubs/netra.html",
    "clubs/iran-zamin.html",
    "bento_extracted.html",
    "clubs/arena.html",
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
    "mediakit/index.html",
    "proposal/index.html",
    "assets/proposal_bg_pattern.jpg",
    "assets/silveriom_network_map.jpg",
    "api/submit_proposal.php"
,
    "panel/admin.css",
    "panel/auth.css",
    "panel/style.css",
    "panel/admin.js",
    "panel/auth.js",
    "panel/client_sync.js",
    "panel/api.php",
    "panel/upload.php",
    "panel/lucide.min.js",
    "panel/xlsx.full.min.js"];

$success = 0;
$failed = [];
foreach($files as $file) {
    // Try curl first
    $url = "https://raw.githubusercontent.com/mhghatee/Silveriom/main/" . str_replace(" ", "%20", $file) . "?v=" . time() . rand(1, 1000);
    
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
    
    if($content !== FALSE && $httpcode == 200) {
        file_put_contents($file, $content);
        $success++;
    } else {
        $failed[] = $file . " (HTTP " . $httpcode . ")";
    }
}
echo "SYNC_SUCCESS: $success/" . count($files) . "\n";
if (count($failed) > 0) {
    echo "FAILED: \n" . implode("\n", $failed);
}
?>
