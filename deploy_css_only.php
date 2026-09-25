<?php
// Force sync global-nav.css only (the key file)
$file = "assets/css/global-nav.css";
$url = "https://raw.githubusercontent.com/mhghatee/Silveriom/main/assets/css/global-nav.css?nocache=" . time() . rand(1,9999);

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
    $dir = dirname($file);
    if ($dir != "." && !is_dir($dir)) { mkdir($dir, 0777, true); }
    file_put_contents($file, $content);
    $lines = substr_count($content, "\n");
    echo "SUCCESS: global-nav.css synced! ($lines lines)\n";
    echo "First 200 chars:\n" . substr($content, 0, 200);
} else {
    echo "FAILED: HTTP $httpcode\n";
    echo "URL tried: $url\n";
}
?>
