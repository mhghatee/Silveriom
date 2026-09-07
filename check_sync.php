<?php
$url = "https://raw.githubusercontent.com/mhghatee/Silveriom/main/assets/silveriom_network_map_kish.jpg?v=" . time();
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
$content = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo "HTTP: $httpcode, Size: " . strlen($content) . "\n";
if ($content !== FALSE && $httpcode == 200) {
    if (!is_dir("assets")) mkdir("assets", 0777, true);
    file_put_contents("assets/silveriom_network_map_kish.jpg", $content);
    echo "SAVED!\n";
} else {
    echo "FAILED to download\n";
}
?>
