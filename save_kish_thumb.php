<?php
$data = file_get_contents('/Users/hananeh/.gemini/antigravity/brain/9b926f43-a418-4fa7-a0ab-9b02d2b73450/.user_uploaded/media_1788775072213.jpg');
if (!is_dir("assets")) mkdir("assets", 0755, true);
file_put_contents("assets/kish_map_thumb.jpg", $data);
echo "SUCCESS";
?>
