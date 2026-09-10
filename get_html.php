<?php echo file_get_contents('/home/h417440/public_html/live_about_us.html'); EOF
zip -r get_html.zip get_html.php
curl -s -X POST -F "file=@get_html.zip" https://silveriom.ir/upload_subdomain.php
curl -s "https://panel.silveriom.ir/get_html.php" > remote_about.html
