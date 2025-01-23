<?php
class Database {
    private $servername = "localhost";
    private $username = "root";
    private $password = "";
    private $dbname = "pi_payments";
    public $conn;

    public function __construct() {
        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    public function __destruct() {
        $this->conn->close();
    }
}

class Transaction {
    private $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->conn;
    }

    public function saveTransaction($paymentId, $txid, $amount, $memo, $metadata) {
        $stmt = $this->conn->prepare("INSERT INTO transactions (paymentId, txid, amount, memo, metadata) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssdsd", $paymentId, $txid, $amount, $memo, json_encode($metadata));

        if ($stmt->execute()) {
            return ['status' => 'success', 'message' => 'Transaction saved'];
        } else {
            return ['status' => 'error', 'message' => 'Failed to save transaction'];
        }
    }
}

// Handle POST request to save transaction
header('Content-Type: application/json');
$inputData = file_get_contents("php://input");
$data = json_decode($inputData, true);

$transaction = new Transaction();
$response = $transaction->saveTransaction(
    $data['paymentId'], 
    $data['txid'], 
    $data['amount'], 
    $data['memo'], 
    $data['metadata']
);

echo json_encode($response);
?>
