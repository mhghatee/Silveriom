<?php
$code = <<<'EOD'
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

// --- LAYER 1: CONFIGURATION ---
class Config {
    public static $dbHost = 'localhost';
    public static $dbName = 'h417440_panel';
    public static $dbUser = 'h417440_panel';
    public static $dbPass = 'Mhg@H@7479#';
}

// --- LAYER 2: CORE DATABASE (PDO WRAPPER) ---
class Database {
    private static $pdo = null;
    public static function getConnection() {
        if (self::$pdo === null) {
            $dsn = "mysql:host=" . Config::$dbHost . ";dbname=" . Config::$dbName . ";charset=utf8mb4";
            self::$pdo = new PDO($dsn, Config::$dbUser, Config::$dbPass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
        }
        return self::$pdo;
    }
}

// --- LAYER 3: REPOSITORIES (Data Access) ---
class InventoryRepository {
    public function getAll() {
        $stmt = Database::getConnection()->query("SELECT * FROM inventory_assets");
        return $stmt->fetchAll();
    }
    public function saveAll($inventoryList) {
        $pdo = Database::getConnection();
        // Clear old inventory to perfectly mirror state (or use UPSERT)
        // For strict sync with frontend state, we TRUNCATE and re-insert, but safely in transaction.
        $pdo->exec("DELETE FROM inventory_assets");
        $stmt = $pdo->prepare("INSERT INTO inventory_assets (id, code, title, tariff, dimensions, views, print_type, audience, status, image, type, location, display_pages, tag, impact, specs, avail, `desc`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        foreach ($inventoryList as $inv) {
            $stmt->execute([
                $inv['id'] ?? uniqid(), $inv['code'] ?? '', $inv['title'] ?? '', $inv['tariff'] ?? '',
                $inv['dimensions'] ?? '', $inv['views'] ?? '', $inv['print_type'] ?? '', $inv['audience'] ?? '',
                $inv['status'] ?? '', $inv['image'] ?? '', $inv['type'] ?? '', $inv['location'] ?? '',
                $inv['display_pages'] ?? '', $inv['tag'] ?? '', $inv['impact'] ?? '', is_array($inv['specs'] ?? '') ? json_encode($inv['specs']) : ($inv['specs'] ?? ''),
                $inv['avail'] ?? '', $inv['desc'] ?? ''
            ]);
        }
    }
}

class LeadsRepository {
    public function getAll() {
        $stmt = Database::getConnection()->query("SELECT * FROM leads");
        $leads = $stmt->fetchAll();
        foreach ($leads as &$lead) {
            $lead['cart'] = json_decode($lead['cart'], true);
        }
        return $leads;
    }
    public function saveAll($leadsList) {
        $pdo = Database::getConnection();
        $pdo->exec("DELETE FROM leads");
        $stmt = $pdo->prepare("INSERT INTO leads (id, name, brand, phone, cart, created_at) VALUES (?,?,?,?,?,?)");
        foreach ($leadsList as $lead) {
            $stmt->execute([
                $lead['id'] ?? uniqid(), $lead['name'] ?? '', $lead['brand'] ?? '',
                $lead['phone'] ?? '', json_encode($lead['cart'] ?? []), $lead['created_at'] ?? ''
            ]);
        }
    }
}

class LegacyStoreRepository {
    public function getAll() {
        $stmt = Database::getConnection()->query("SELECT * FROM legacy_store");
        $store = [];
        foreach ($stmt->fetchAll() as $row) {
            $store[$row['store_key']] = json_decode($row['store_value'], true);
        }
        return $store;
    }
    public function save($key, $data) {
        $stmt = Database::getConnection()->prepare("INSERT INTO legacy_store (store_key, store_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE store_value = VALUES(store_value)");
        $stmt->execute([$key, json_encode($data)]);
    }
}

// --- LAYER 4: SERVICE (Business Logic & Transactions) ---
class AppService {
    private $invRepo;
    private $leadsRepo;
    private $storeRepo;

    public function __construct() {
        $this->invRepo = new InventoryRepository();
        $this->leadsRepo = new LeadsRepository();
        $this->storeRepo = new LegacyStoreRepository();
    }

    public function loadFullState() {
        $state = $this->storeRepo->getAll(); // Loads settings, aboutUs, venues, etc.
        $state['mediaInventory'] = $this->invRepo->getAll();
        $state['inquiries'] = $this->leadsRepo->getAll();
        
        // Ensure defaults exist
        $defaults = ['settings' => new stdClass(), 'aboutUs' => new stdClass(), 'metrics' => [], 'venues' => [], 'portfolio' => [], 'users' => [], 'audience' => new stdClass()];
        foreach($defaults as $k => $v) {
            if(!isset($state[$k])) $state[$k] = $v;
        }
        return $state;
    }

    public function saveFullState($state) {
        $pdo = Database::getConnection();
        $pdo->beginTransaction();
        try {
            if (isset($state['mediaInventory'])) {
                $this->invRepo->saveAll($state['mediaInventory']);
            }
            if (isset($state['inquiries'])) {
                $this->leadsRepo->saveAll($state['inquiries']);
            }
            
            $legacyKeys = ['settings', 'aboutUs', 'metrics', 'venues', 'portfolio', 'users', 'audience', 'homePage', 'mediaPlanner', 'portfolioPage', 'contactUs'];
            foreach ($legacyKeys as $key) {
                if (isset($state[$key])) {
                    $this->storeRepo->save($key, $state[$key]);
                }
            }
            $pdo->commit();
            return true;
        } catch (Exception $e) {
            $pdo->rollBack();
            throw $e;
        }
    }
}

// --- LAYER 5: CONTROLLER (API Gateway) ---
class ApiController {
    public function handleRequest() {
        $action = $_GET['action'] ?? '';
        $service = new AppService();

        if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'load') {
            try {
                $state = $service->loadFullState();
                echo json_encode($state);
            } catch (Exception $e) {
                echo json_encode(['error' => $e->getMessage()]);
            }
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $inputJSON = file_get_contents('php://input');
            $input = json_decode($inputJSON, true);
            
            if (isset($input['action']) && $input['action'] === 'save_all' && isset($input['state'])) {
                try {
                    $service->saveFullState($input['state']);
                    echo json_encode(['success' => true]);
                } catch (Exception $e) {
                    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
                }
                exit;
            }
        }

        echo json_encode(['success' => false, 'error' => 'Invalid request']);
    }
}

// --- BOOTSTRAP ---
$app = new ApiController();
$app->handleRequest();
?>
EOD;

file_put_contents('layered_api.php', $code);
echo "Generated layered_api.php\n";
?>
