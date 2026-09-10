<?php
$files = glob('/home/h417440/public_html/*.html');
foreach($files as $f) {
    $content = file_get_contents($f);
    // Replace my transparent ones back to /favicon.png?v=3
    $content = preg_replace('/<link rel="icon" type="image\/png" href="\/favicon-transparent-512x512\.png\?v=4" sizes="512x512">\s*<link rel="icon" type="image\/png" href="\/favicon-transparent-32x32\.png\?v=4" sizes="32x32">\s*<link rel="icon" type="image\/svg\+xml" href="\/favicon-transparent\.svg\?v=4">/', '<link rel="icon" type="image/png" href="/favicon.png?v=3" sizes="any">', $content);
    
    $content = preg_replace('/<link rel="apple-touch-icon" href="\/favicon-transparent-512x512\.png\?v=4">/', '<link rel="apple-touch-icon" href="/favicon.png?v=3">', $content);
    
    file_put_contents($f, $content);
}
echo "SUCCESS";
