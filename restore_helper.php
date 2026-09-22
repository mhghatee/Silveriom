<?php
// Restore DB from backup
$src = __DIR__ . '/data_restore/silveriom_db.json';
$dst = '/home/h417440/public_html/data/silveriom_db.json';
$dst2 = '/home/h417440/panel.silveriom.ir/data/silveriom_db.json';
if (!is_dir(dirname($dst2))) mkdir(dirname($dst2), 0777, true);
$data = file_get_contents($src);
$ok1 = file_put_contents($dst, $data);
$ok2 = file_put_contents($dst2, $data);
echo json_encode(['ok1'=>$ok1, 'ok2'=>$ok2]);
