<?php
$files = scandir('/home/h417440/public_html/panel/');
echo json_encode($files);
