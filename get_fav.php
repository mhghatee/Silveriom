<?php echo file_get_contents('/home/h417440/public_html/index.html'); EOF
zip -r get_fav.zip get_fav.php
curl -s -X POST -F "file=@get_fav.zip" https://silveriom.ir/upload_subdomain.php
curl -s "https://panel.silveriom.ir/get_fav.php" | grep "favicon"