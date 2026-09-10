<?php echo implode("\n", glob('/home/h417440/public_html/*.html')); EOF
zip -r ls_html.zip ls_html.php
curl -s -X POST -F "file=@ls_html.zip" https://silveriom.ir/upload_subdomain.php
curl -s "https://panel.silveriom.ir/ls_html.php"