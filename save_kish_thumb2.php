<?php
$url = "https://raw.githubusercontent.com/mhghatee/Silveriom/main/assets/kish_map_thumb.jpg";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
$data = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($code == 200 && strlen($data) > 1000) {
    if (!is_dir("assets")) mkdir("assets", 0755, true);
    file_put_contents("assets/kish_map_thumb.jpg", $data);
    echo "SUCCESS: saved";
} else {
    echo "FAILED: HTTP $code";
}
?>
