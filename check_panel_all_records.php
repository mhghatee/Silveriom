<?php
header('Content-Type: application/json');
$f = '/home/h417440/panel.silveriom.ir/data/silveriom_db.json';
if (file_exists($f)) {
    $db = json_decode(file_get_contents($f), true);
    $media = $db['mediaInventory'] ?? [];
    $result = [];
    foreach ($media as $item) {
        $result[] = [
            'id' => $item['id'],
            'title' => $item['title'],
            'tariff' => $item['tariff'] ?? '',
            'impact' => $item['impact'] ?? '',
            'specs' => $item['specs'] ?? '',
            'tag' => $item['tag'] ?? '',
            'status' => $item['status'] ?? ''
        ];
    }
    echo json_encode(['count' => count($media), 'items' => $result], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(['error' => 'file not found']);
}
