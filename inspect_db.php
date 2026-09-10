<?php
$json = file_get_contents('data/silveriom_db.json');
$data = json_decode($json, true);
foreach($data as $key => $val){
    if(is_array($val)){
        if (array_keys($val) === range(0, count($val) - 1)) {
            echo "$key: " . count($val) . " items (List)\n";
            if(count($val)>0 && is_array($val[0])){
                echo "  Keys: " . implode(', ', array_keys($val[0])) . "\n";
            }
        } else {
            echo "$key: Object/Dict\n";
            echo "  Keys: " . implode(', ', array_keys($val)) . "\n";
        }
    } else {
        echo "$key: Scalar\n";
    }
}
?>
