<?php

class Cart {
    private $conn;
    private $table_name = "cart_items";

    public $id;
    public $user_id;
    public $book_id;
    public $quantity;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Obtener carrito de un usuario con información de libros
    public function getByUserId() {
        $query = "SELECT
                    c.id,
                    c.user_id,
                    c.book_id,
                    c.quantity,
                    c.created_at,
                    b.id as book_id,
                    b.title,
                    b.author,
                    b.year,
                    b.description,
                    b.price,
                    b.stock,
                    b.image_url,
                    b.category,
                    b.isbn
                 FROM " . $this->table_name . " c
                 LEFT JOIN books b ON c.book_id = b.id
                 WHERE c.user_id = ?
                 ORDER BY c.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->user_id);
        $stmt->execute();
        return $stmt;
    }

    // Agregar al carrito o actualizar cantidad si ya existe
    public function addOrUpdate() {
        // Primero verificar si ya existe
        $query = "SELECT id, quantity FROM " . $this->table_name . " WHERE user_id = ? AND book_id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->user_id);
        $stmt->bindParam(2, $this->book_id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $new_quantity = $row['quantity'] + ($this->quantity ?? 1);
            return $this->updateQuantity($new_quantity);
        } else {
            return $this->create();
        }
    }

    // Crear item en carrito
    private function create() {
        $query = "INSERT INTO " . $this->table_name . " (user_id, book_id, quantity) VALUES (:user_id, :book_id, :quantity)";
        $stmt = $this->conn->prepare($query);

        $quantity = $this->quantity ?? 1;
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":book_id", $this->book_id);
        $stmt->bindParam(":quantity", $quantity);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    // Actualizar cantidad
    public function updateQuantity($new_quantity) {
        $query = "UPDATE " . $this->table_name . " SET quantity = :quantity WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":quantity", $new_quantity);
        $stmt->bindParam(":id", $this->id);
        return $stmt->execute();
    }

    // Eliminar item del carrito
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        return $stmt->execute();
    }

    // Limpiar todo el carrito de un usuario
    public function clearUserCart() {
        $query = "DELETE FROM " . $this->table_name . " WHERE user_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->user_id);
        return $stmt->execute();
    }
}
