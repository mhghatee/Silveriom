<?php
$url = "https://raw.githubusercontent.com/mhghatee/silveriom/main/loading_video.mp4";
$content = @file_get_contents($url);
if($content !== FALSE) {
    file_put_contents("loading_video.mp4", $content);
    echo "SUCCESS";
} else {
    echo "FAILED";
}
?>
