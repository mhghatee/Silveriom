<?php
$files = glob('/home/h417440/public_html/*.html');
foreach($files as $f) {
    $content = file_get_contents($f);
    $content = preg_replace('/<link rel="icon"[^>]*href="[^"]*favicon\.png[^"]*"[^>]*>/', '<link rel="icon" type="image/png" href="/favicon-transparent-512x512.png?v=4" sizes="512x512">
  <link rel="icon" type="image/png" href="/favicon-transparent-32x32.png?v=4" sizes="32x32">
  <link rel="icon" type="image/svg+xml" href="/favicon-transparent.svg?v=4">', $content);
    
    $content = preg_replace('/<link rel="apple-touch-icon"[^>]*href="[^"]*favicon\.png[^"]*"[^>]*>/', '<link rel="apple-touch-icon" href="/favicon-transparent-512x512.png?v=4">', $content);
    
    file_put_contents($f, $content);
}
echo "SUCCESS";
