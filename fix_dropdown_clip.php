<?php
// We need to fix the WebKit clipping bug caused by backdrop-filter + border-radius on .nav-links
// We will change .nav-links to not have backdrop-filter directly, and add it via ::before
$css_fix = "
<style id=\"silveriom-dropdown-clip-fix\">
  /* Fix Safari/WebKit clipping bug for dropdowns inside elements with backdrop-filter and border-radius */
  .nav-links {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background: transparent !important;
    position: relative;
  }
  .nav-links::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(13, 22, 45, 0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50px;
    z-index: -1;
  }
  .nav-dropdown-menu {
    z-index: 10000 !important;
  }
</style>
";

function process_file($filepath) {
    global $css_fix;
    if(!file_exists($filepath)) return;
    $content = file_get_contents($filepath);
    
    // Don't inject multiple times
    if(strpos($content, 'silveriom-dropdown-clip-fix') !== false) {
        return;
    }
    
    // Insert before </head>
    $content = str_replace('</head>', $css_fix . "\n</head>", $content);
    file_put_contents($filepath, $content);
    echo "Fixed $filepath\n";
}

$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator('/home/h417440/public_html/'));
foreach($iterator as $file) {
    if($file->getExtension() === 'html' || $file->getExtension() === 'php') {
        $path = $file->getRealPath();
        // Skip panel directory entirely
        if(strpos($path, '/panel/') !== false) continue;
        process_file($path);
    }
}
echo "SUCCESS";
