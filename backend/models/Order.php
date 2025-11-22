<?php

class Order {
    private $conn;
    private $table_name = "orders";
    private $order_items_table = "order_items";

    public $id;
    public $user_id;
    public $total_amount;
    public $status;
    public $shipping_address;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Obtener todas las órdenes con información de usuario
    public function getAll() {
        $query = "SELECT
                    o.*,
                    u.username,
                    u.email
                 FROM " . $this->table_name . " o
                 LEFT JOIN users u ON o.user_id = u.id
                 ORDER BY o.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Obtener órdenes de un usuario específico
    public function getByUserId() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE user_id = ? ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->user_id);
        $stmt->execute();
        return $stmt;
    }

    // Obtener orden por ID con items
    public function getById() {
        $query = "SELECT
                    o.*,
                    u.username,
                    u.email
                 FROM " . $this->table_name . " o
                 LEFT JOIN users u ON o.user_id = u.id
                 WHERE o.id = ?
                 LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        return $stmt;
    }

    // Obtener items de una orden
    public function getOrderItems() {
        $query = "SELECT
                    oi.*,
                    b.title,
                    b.author,
                    b.image_url,
                    b.isbn
                 FROM " . $this->order_items_table . " oi
                 LEFT JOIN books b ON oi.book_id = b.id
                 WHERE oi.order_id = ?";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        return $stmt;
    }

    // Crear orden
    public function create($items) {
        try {
            $this->conn->beginTransaction();

            // Crear la orden
            $query = "INSERT INTO " . $this->table_name . "
                     (user_id, total_amount, status, shipping_address)
                     VALUES (:user_id, :total_amount, :status, :shipping_address)";

            $stmt = $this->conn->prepare($query);
            $status = $this->status ?? 'pending';

            $stmt->bindParam(":user_id", $this->user_id);
            $stmt->bindParam(":total_amount", $this->total_amount);
            $stmt->bindParam(":status", $status);
            $stmt->bindParam(":shipping_address", $this->shipping_address);

            if (!$stmt->execute()) {
                $this->conn->rollBack();
                return false;
            }

            $this->id = $this->conn->lastInsertId();

            // Insertar items de la orden
            $query = "INSERT INTO " . $this->order_items_table . "
                     (order_id, book_id, quantity, price)
                     VALUES (:order_id, :book_id, :quantity, :price)";

            $stmt = $this->conn->prepare($query);

            foreach ($items as $item) {
                $stmt->bindParam(":order_id", $this->id);
                $stmt->bindParam(":book_id", $item['book_id']);
                $stmt->bindParam(":quantity", $item['quantity']);
                $stmt->bindParam(":price", $item['price']);

                if (!$stmt->execute()) {
                    $this->conn->rollBack();
                    return false;
                }

                // Actualizar stock del libro
                $updateStock = "UPDATE books SET stock = stock - :quantity WHERE id = :book_id";
                $stmtStock = $this->conn->prepare($updateStock);
                $stmtStock->bindParam(":quantity", $item['quantity']);
                $stmtStock->bindParam(":book_id", $item['book_id']);

                if (!$stmtStock->execute()) {
                    $this->conn->rollBack();
                    return false;
                }
            }

            $this->conn->commit();
            return true;

        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    // Actualizar estado de orden
    public function updateStatus() {
        $query = "UPDATE " . $this->table_name . " SET status = :status WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":id", $this->id);
        return $stmt->execute();
    }

    // Actualizar dirección de envío
    public function updateShippingAddress() {
        $query = "UPDATE " . $this->table_name . " SET shipping_address = :shipping_address WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":shipping_address", $this->shipping_address);
        $stmt->bindParam(":id", $this->id);
        return $stmt->execute();
    }

    // Eliminar orden
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        return $stmt->execute();
    }
}
