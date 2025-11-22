-- Crear base de datos
CREATE DATABASE IF NOT EXISTS libreria_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE libreria_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de libros
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    year INT,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    category VARCHAR(50),
    isbn VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_title (title),
    INDEX idx_author (author),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de carrito de compras
CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_book (user_id, book_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de órdenes
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'sent', 'completed', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de items de orden
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    book_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id),
    INDEX idx_order_id (order_id),
    INDEX idx_book_id (book_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuario administrador por defecto (password: admin123)
INSERT INTO users (username, email, password, is_admin)
VALUES ('admin', 'admin@nidoliterario.com', '$2y$10$6VJ9lChd/ofhx1B9l82k9eWylMVyeGIXLgYqmhszKIXXFauR4Br8i', TRUE)
ON DUPLICATE KEY UPDATE username = username;

-- Insertar usuario demo (password: demo123)
INSERT INTO users (username, email, password, is_admin)
VALUES ('usuario_demo', 'usuario@demo.com', '$2y$10$8FYIpNvd/KIzvENUjFWbT.kdG4p6RGGo.GsNR5h.aubo4vLh/aLLm', FALSE)
ON DUPLICATE KEY UPDATE username = username;

-- Insertar libros de ejemplo
INSERT INTO books (title, author, year, description, price, stock, image_url, category, isbn) VALUES
('Cien años de soledad', 'Gabriel García Márquez', 1967,
 'Narra el ascenso y la caída de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo, explorando temas como el incesto, el mito, la historia y la soledad, en una de las obras cumbres del realismo mágico.',
 300.00, 3, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop', 'Ficción', '978-0307474728'),

('Don Quijote de la Mancha', 'Miguel de Cervantes', 1605,
 'Alonso Quijano, un hidalgo cincuentón, enloquece leyendo libros de caballerías y decide convertirse en el caballero andante Don Quijote, acompañado de su escudero Sancho Panza, para \'desfacer entuertos\' y buscar la gloria. Es considerada la primera novela moderna.',
 450.00, 7, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop', 'Clásicos', '978-8491050841'),

('1984', 'George Orwell', 1949,
 'En un futuro distópico, la sociedad es controlada por un régimen totalitario liderado por el omnipresente \'Gran Hermano\'. Winston Smith, un empleado del Ministerio de la Verdad, intenta rebelarse contra el sistema y su control absoluto sobre el pensamiento.',
 250.00, 15, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop', 'Distopía', '978-0451524935'),

('Crimen y castigo', 'Fiódor Dostoyevski', 1866,
 'El estudiante Rodión Raskólnikov asesina a una vieja usurera en San Petersburgo para demostrar una teoría sobre la moralidad y la existencia de hombres \'extraordinarios\'. La novela explora su tormento psicológico, su culpa y su camino hacia la redención.',
 250.00, 2, 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=400&h=600&fit=crop', 'Clásicos', '978-0143058144'),

('Orgullo y prejuicio', 'Jane Austen', 1813,
 'Ambientada en la Inglaterra rural, sigue la vida de las cinco hermanas Bennet, centrándose en la relación entre la vivaz e inteligente Elizabeth Bennet y el orgulloso señor Darcy. Es una sátira social sobre las costumbres, el matrimonio y la moral de la época.',
 150.00, 10, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop', 'Romance', '978-0141439518'),

('El señor de los anillos', 'J. R. R. Tolkien', 1954,
 'En la Tierra Media, el hobbit Frodo Bolsón hereda un artefacto de inmenso poder maligno. Junto a una comunidad de compañeros, emprende una épica misión para destruirlo en el Monte del Destino y salvar al mundo de la oscuridad de Sauron.',
 500.00, 8, 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop', 'Fantasía', '978-0544003415'),

('El extranjero', 'Albert Camus', 1942,
 'Narrada en primera persona por Meursault, un hombre de origen francés que vive en Argelia. Tras el funeral de su madre, se ve involucrado en un acto de violencia sin sentido que lo lleva a cuestionar la existencia y la indiferencia del universo. Es una obra clave del existencialismo.',
 320.00, 4, 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop', 'Filosofía', '978-0679720201'),

('Matar un ruiseñor', 'Harper Lee', 1960,
 'En la Alabama de los años 30, la joven Scout Finch narra la historia de su padre, el abogado Atticus Finch, quien defiende a un hombre negro acusado injustamente de violación, explorando temas de racismo, injusticia y pérdida de la inocencia.',
 280.00, 12, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop', 'Ficción', '978-0061120084')
ON DUPLICATE KEY UPDATE title = title;
