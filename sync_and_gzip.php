<?php
// 1. Setup GZIP in .htaccess
$htaccess_path = '.htaccess';
$gzip_rules = "
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>
";
if(file_exists($htaccess_path)) {
    $current = file_get_contents($htaccess_path);
    if(strpos($current, 'mod_deflate.c') === false) {
        file_put_contents($htaccess_path, $current . "\n" . $gzip_rules);
    }
} else {
    file_put_contents($htaccess_path, $gzip_rules);
}

// 2. Sync all modified files from GitHub
$files = [
    "about-us/index.html",
    "audience-intelligence/design_proposals.html",
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
    "index.html",
    "media-planner/index.html",
    "panel/admin.html",
    "panel/fetched_login.html",
    "panel/index.html",
    "panel/login.html",
    "panel/original_login_server.html",
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
