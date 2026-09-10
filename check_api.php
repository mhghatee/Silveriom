<?php echo is_dir('/home/h417440/public_html/api') ? "EXISTS" : "NO_DIR"; EOF
zip -r check_api.zip check_api.php
curl -s -X POST -F "file=@check_api.zip" https://silveriom.ir/upload_subdomain.php
curl -s "https://panel.silveriom.ir/check_api.php"