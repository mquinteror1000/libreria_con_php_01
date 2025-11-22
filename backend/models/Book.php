<?php

class Book {
    private $conn;
    private $table_name = "books";

    public $id;
    public $title;
    public $author;
    public $year;
    public $description;
    public $price;
    public $stock;
    public $image_url;
    public $category;
    public $isbn;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Obtener todos los libros
    public function getAll() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Obtener libro por ID
    public function getById() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        return $stmt;
    }

    // Crear libro
    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                 (title, author, year, description, price, stock, image_url, category, isbn)
                 VALUES (:title, :author, :year, :description, :price, :stock, :image_url, :category, :isbn)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":author", $this->author);
        $stmt->bindParam(":year", $this->year);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":stock", $this->stock);
        $stmt->bindParam(":image_url", $this->image_url);
        $stmt->bindParam(":category", $this->category);
        $stmt->bindParam(":isbn", $this->isbn);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    // Actualizar libro
    public function update() {
        $query = "UPDATE " . $this->table_name . "
                 SET title = :title,
                     author = :author,
                     year = :year,
                     description = :description,
                     price = :price,
                     stock = :stock,
                     image_url = :image_url,
                     category = :category,
                     isbn = :isbn
                 WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":author", $this->author);
        $stmt->bindParam(":year", $this->year);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":stock", $this->stock);
        $stmt->bindParam(":image_url", $this->image_url);
        $stmt->bindParam(":category", $this->category);
        $stmt->bindParam(":isbn", $this->isbn);
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
    }

    // Actualizar solo stock
    public function updateStock($quantity) {
        $query = "UPDATE " . $this->table_name . " SET stock = stock - :quantity WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":quantity", $quantity);
        $stmt->bindParam(":id", $this->id);
        return $stmt->execute();
    }

    // Eliminar libro
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        return $stmt->execute();
    }
}
