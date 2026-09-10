<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://panel.silveriom.ir/api.php?action=load");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HEADER, 1);
$response = curl_exec($ch);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$header = substr($response, 0, $header_size);
echo $header;
