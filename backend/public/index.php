<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Manejar solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Incluir archivos necesarios
require_once '../config/database.php';
require_once '../models/User.php';
require_once '../models/Book.php';
require_once '../models/Cart.php';
require_once '../models/Order.php';

// Obtener la conexión a la base de datos
$database = new Database();
$db = $database->getConnection();

// Obtener el método HTTP y la URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

// Función helper para enviar respuestas JSON
function sendResponse($data, $code = 200) {
    http_response_code($code);
    echo json_format(json_encode($data));
    exit();
}

function json_format($json) {
    return $json;
}

// Obtener datos del body
$input = json_decode(file_get_contents('php://input'), true);

// ==================== RUTAS DE AUTENTICACIÓN ====================

// POST /api/auth/register
if ($method === 'POST' && count($uri) >= 3 && $uri[2] === 'auth' && $uri[3] === 'register') {
    $user = new User($db);
    $user->username = $input['username'] ?? '';
    $user->email = $input['email'] ?? '';
    $user->password = $input['password'] ?? '';
    $user->is_admin = $input['is_admin'] ?? 0;

    if (empty($user->username) || empty($user->email) || empty($user->password)) {
        sendResponse(['error' => 'Todos los campos son requeridos'], 400);
    }

    // Verificar si ya existe el email o username
    $user->email = $input['email'];
    $stmt = $user->getByEmail();
    if ($stmt->rowCount() > 0) {
        sendResponse(['error' => 'El email ya está registrado'], 409);
    }

    $user->username = $input['username'];
    $stmt = $user->getByUsername();
    if ($stmt->rowCount() > 0) {
        sendResponse(['error' => 'El nombre de usuario ya está en uso'], 409);
    }

    // Restaurar valores
    $user->username = $input['username'];
    $user->email = $input['email'];
    $user->password = $input['password'];
    $user->is_admin = isset($input['is_admin']) ? (int)$input['is_admin'] : 0;

    if ($user->create()) {
        sendResponse([
            'message' => 'Usuario creado exitosamente',
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'is_admin' => (bool)$user->is_admin,
                'created_at' => date('Y-m-d H:i:s')
            ]
        ], 201);
    } else {
        sendResponse(['error' => 'No se pudo crear el usuario'], 500);
    }
}

// POST /api/auth/login
if ($method === 'POST' && count($uri) >= 3 && $uri[2] === 'auth' && $uri[3] === 'login') {
    $user = new User($db);
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';

    if (empty($username) || empty($password)) {
        sendResponse(['error' => 'Usuario y contraseña son requeridos'], 400);
    }

    // Try to find user by email or username
    $user->email = $username;
    $stmt = $user->getByEmail();

    if ($stmt->rowCount() === 0) {
        // If not found by email, try username
        $user->username = $username;
        $stmt = $user->getByUsername();
    }

    if ($stmt->rowCount() === 0) {
        sendResponse(['error' => 'Credenciales inválidas'], 401);
    }

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (password_verify($password, $row['password'])) {
        sendResponse([
            'message' => 'Login exitoso',
            'user' => [
                'id' => $row['id'],
                'username' => $row['username'],
                'email' => $row['email'],
                'is_admin' => (bool)$row['is_admin'],
                'created_at' => $row['created_at']
            ]
        ]);
    } else {
        sendResponse(['error' => 'Credenciales inválidas'], 401);
    }
}

// ==================== RUTAS DE USUARIOS ====================

// GET /api/users - Obtener todos los usuarios
if ($method === 'GET' && count($uri) >= 3 && $uri[2] === 'users' && !isset($uri[3])) {
    $user = new User($db);
    $stmt = $user->getAll();
    $users = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $users[] = [
            'id' => $row['id'],
            'username' => $row['username'],
            'email' => $row['email'],
            'is_admin' => (bool)$row['is_admin'],
            'created_at' => $row['created_at']
        ];
    }

    sendResponse($users);
}

// GET /api/users/:id - Obtener usuario por ID
if ($method === 'GET' && count($uri) >= 4 && $uri[2] === 'users' && is_numeric($uri[3])) {
    $user = new User($db);
    $user->id = $uri[3];
    $stmt = $user->getById();

    if ($stmt->rowCount() === 0) {
        sendResponse(['error' => 'Usuario no encontrado'], 404);
    }

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    sendResponse([
        'id' => $row['id'],
        'username' => $row['username'],
        'email' => $row['email'],
        'is_admin' => (bool)$row['is_admin'],
        'created_at' => $row['created_at']
    ]);
}

// PUT /api/users/:id - Actualizar usuario
if ($method === 'PUT' && count($uri) >= 4 && $uri[2] === 'users' && is_numeric($uri[3])) {
    $user = new User($db);
    $user->id = $uri[3];
    $user->username = $input['username'] ?? '';
    $user->email = $input['email'] ?? '';
    $user->is_admin = $input['is_admin'] ?? 0;

    if ($user->update()) {
        sendResponse(['message' => 'Usuario actualizado exitosamente']);
    } else {
        sendResponse(['error' => 'No se pudo actualizar el usuario'], 500);
    }
}

// DELETE /api/users/:id - Eliminar usuario
if ($method === 'DELETE' && count($uri) >= 4 && $uri[2] === 'users' && is_numeric($uri[3])) {
    $user = new User($db);
    $user->id = $uri[3];

    if ($user->delete()) {
        sendResponse(['message' => 'Usuario eliminado exitosamente']);
    } else {
        sendResponse(['error' => 'No se pudo eliminar el usuario'], 500);
    }
}

// ==================== RUTAS DE LIBROS ====================

// GET /api/books - Obtener todos los libros
if ($method === 'GET' && count($uri) >= 3 && $uri[2] === 'books' && !isset($uri[3])) {
    $book = new Book($db);
    $stmt = $book->getAll();
    $books = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $books[] = $row;
    }

    sendResponse($books);
}

// GET /api/books/:id - Obtener libro por ID
if ($method === 'GET' && count($uri) >= 4 && $uri[2] === 'books' && is_numeric($uri[3])) {
    $book = new Book($db);
    $book->id = $uri[3];
    $stmt = $book->getById();

    if ($stmt->rowCount() === 0) {
        sendResponse(['error' => 'Libro no encontrado'], 404);
    }

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    sendResponse($row);
}

// POST /api/books - Crear libro
if ($method === 'POST' && count($uri) >= 3 && $uri[2] === 'books' && !isset($uri[3])) {
    $book = new Book($db);
    $book->title = $input['title'] ?? '';
    $book->author = $input['author'] ?? '';
    $book->year = $input['year'] ?? null;
    $book->description = $input['description'] ?? '';
    $book->price = $input['price'] ?? 0;
    $book->stock = $input['stock'] ?? 0;
    $book->image_url = $input['image_url'] ?? '';
    $book->category = $input['category'] ?? '';
    $book->isbn = $input['isbn'] ?? '';

    if ($book->create()) {
        sendResponse([
            'message' => 'Libro creado exitosamente',
            'id' => $book->id
        ], 201);
    } else {
        sendResponse(['error' => 'No se pudo crear el libro'], 500);
    }
}

// PUT /api/books/:id - Actualizar libro
if ($method === 'PUT' && count($uri) >= 4 && $uri[2] === 'books' && is_numeric($uri[3])) {
    $book = new Book($db);
    $book->id = $uri[3];
    $book->title = $input['title'] ?? '';
    $book->author = $input['author'] ?? '';
    $book->year = $input['year'] ?? null;
    $book->description = $input['description'] ?? '';
    $book->price = $input['price'] ?? 0;
    $book->stock = $input['stock'] ?? 0;
    $book->image_url = $input['image_url'] ?? '';
    $book->category = $input['category'] ?? '';
    $book->isbn = $input['isbn'] ?? '';

    if ($book->update()) {
        sendResponse(['message' => 'Libro actualizado exitosamente']);
    } else {
        sendResponse(['error' => 'No se pudo actualizar el libro'], 500);
    }
}

// DELETE /api/books/:id - Eliminar libro
if ($method === 'DELETE' && count($uri) >= 4 && $uri[2] === 'books' && is_numeric($uri[3])) {
    $book = new Book($db);
    $book->id = $uri[3];

    if ($book->delete()) {
        sendResponse(['message' => 'Libro eliminado exitosamente']);
    } else {
        sendResponse(['error' => 'No se pudo eliminar el libro'], 500);
    }
}

// ==================== RUTAS DE CARRITO ====================

// GET /api/cart/:userId - Obtener carrito de usuario
if ($method === 'GET' && count($uri) >= 4 && $uri[2] === 'cart' && is_numeric($uri[3])) {
    $cart = new Cart($db);
    $cart->user_id = $uri[3];
    $stmt = $cart->getByUserId();
    $items = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $items[] = [
            'id' => $row['id'],
            'user_id' => $row['user_id'],
            'book_id' => $row['book_id'],
            'quantity' => $row['quantity'],
            'created_at' => $row['created_at'],
            'book' => [
                'id' => $row['book_id'],
                'title' => $row['title'],
                'author' => $row['author'],
                'year' => $row['year'],
                'description' => $row['description'],
                'price' => $row['price'],
                'stock' => $row['stock'],
                'image_url' => $row['image_url'],
                'category' => $row['category'],
                'isbn' => $row['isbn']
            ]
        ];
    }

    sendResponse($items);
}

// POST /api/cart - Agregar al carrito
if ($method === 'POST' && count($uri) >= 3 && $uri[2] === 'cart' && !isset($uri[3])) {
    $cart = new Cart($db);
    $cart->user_id = $input['user_id'] ?? 0;
    $cart->book_id = $input['book_id'] ?? 0;
    $cart->quantity = $input['quantity'] ?? 1;

    if ($cart->addOrUpdate()) {
        sendResponse(['message' => 'Producto agregado al carrito'], 201);
    } else {
        sendResponse(['error' => 'No se pudo agregar al carrito'], 500);
    }
}

// PUT /api/cart/:id - Actualizar cantidad en carrito
if ($method === 'PUT' && count($uri) >= 4 && $uri[2] === 'cart' && is_numeric($uri[3])) {
    $cart = new Cart($db);
    $cart->id = $uri[3];
    $quantity = $input['quantity'] ?? 1;

    if ($cart->updateQuantity($quantity)) {
        sendResponse(['message' => 'Cantidad actualizada']);
    } else {
        sendResponse(['error' => 'No se pudo actualizar la cantidad'], 500);
    }
}

// DELETE /api/cart/:id - Eliminar item del carrito
if ($method === 'DELETE' && count($uri) >= 4 && $uri[2] === 'cart' && is_numeric($uri[3]) && !isset($uri[4])) {
    $cart = new Cart($db);
    $cart->id = $uri[3];

    if ($cart->delete()) {
        sendResponse(['message' => 'Item eliminado del carrito']);
    } else {
        sendResponse(['error' => 'No se pudo eliminar el item'], 500);
    }
}

// DELETE /api/cart/user/:userId - Limpiar carrito de usuario
if ($method === 'DELETE' && count($uri) >= 5 && $uri[2] === 'cart' && $uri[3] === 'user' && is_numeric($uri[4])) {
    $cart = new Cart($db);
    $cart->user_id = $uri[4];

    if ($cart->clearUserCart()) {
        sendResponse(['message' => 'Carrito limpiado']);
    } else {
        sendResponse(['error' => 'No se pudo limpiar el carrito'], 500);
    }
}

// ==================== RUTAS DE ÓRDENES ====================

// GET /api/orders - Obtener todas las órdenes
if ($method === 'GET' && count($uri) >= 3 && $uri[2] === 'orders' && !isset($uri[3])) {
    $order = new Order($db);
    $stmt = $order->getAll();
    $orders = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $order->id = $row['id'];
        $itemsStmt = $order->getOrderItems();
        $items = [];

        while ($item = $itemsStmt->fetch(PDO::FETCH_ASSOC)) {
            $items[] = $item;
        }

        $orders[] = array_merge($row, ['items' => $items]);
    }

    sendResponse($orders);
}

// GET /api/orders/user/:userId - Obtener órdenes de un usuario
if ($method === 'GET' && count($uri) >= 5 && $uri[2] === 'orders' && $uri[3] === 'user' && is_numeric($uri[4])) {
    $order = new Order($db);
    $order->user_id = $uri[4];
    $stmt = $order->getByUserId();
    $orders = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $order->id = $row['id'];
        $itemsStmt = $order->getOrderItems();
        $items = [];

        while ($item = $itemsStmt->fetch(PDO::FETCH_ASSOC)) {
            $items[] = $item;
        }

        $orders[] = array_merge($row, ['items' => $items]);
    }

    sendResponse($orders);
}

// GET /api/orders/:id - Obtener orden por ID
if ($method === 'GET' && count($uri) >= 4 && $uri[2] === 'orders' && is_numeric($uri[3])) {
    $order = new Order($db);
    $order->id = $uri[3];
    $stmt = $order->getById();

    if ($stmt->rowCount() === 0) {
        sendResponse(['error' => 'Orden no encontrada'], 404);
    }

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    // Obtener items
    $itemsStmt = $order->getOrderItems();
    $items = [];

    while ($item = $itemsStmt->fetch(PDO::FETCH_ASSOC)) {
        $items[] = $item;
    }

    sendResponse(array_merge($row, ['items' => $items]));
}

// POST /api/orders - Crear orden
if ($method === 'POST' && count($uri) >= 3 && $uri[2] === 'orders' && !isset($uri[3])) {
    $order = new Order($db);
    $order->user_id = $input['user_id'] ?? 0;
    $order->total_amount = $input['total_amount'] ?? 0;
    $order->shipping_address = $input['shipping_address'] ?? '';
    $items = $input['items'] ?? [];

    if (empty($items)) {
        sendResponse(['error' => 'La orden debe tener al menos un item'], 400);
    }

    if ($order->create($items)) {
        sendResponse([
            'message' => 'Orden creada exitosamente',
            'id' => $order->id
        ], 201);
    } else {
        sendResponse(['error' => 'No se pudo crear la orden'], 500);
    }
}

// PUT /api/orders/:id - Actualizar orden
if ($method === 'PUT' && count($uri) >= 4 && $uri[2] === 'orders' && is_numeric($uri[3])) {
    $order = new Order($db);
    $order->id = $uri[3];

    if (isset($input['status'])) {
        $order->status = $input['status'];
        if ($order->updateStatus()) {
            sendResponse(['message' => 'Estado actualizado exitosamente']);
        }
    } elseif (isset($input['shipping_address'])) {
        $order->shipping_address = $input['shipping_address'];
        if ($order->updateShippingAddress()) {
            sendResponse(['message' => 'Dirección actualizada exitosamente']);
        }
    }

    sendResponse(['error' => 'No se pudo actualizar la orden'], 500);
}

// DELETE /api/orders/:id - Eliminar orden
if ($method === 'DELETE' && count($uri) >= 4 && $uri[2] === 'orders' && is_numeric($uri[3])) {
    $order = new Order($db);
    $order->id = $uri[3];

    if ($order->delete()) {
        sendResponse(['message' => 'Orden eliminada exitosamente']);
    } else {
        sendResponse(['error' => 'No se pudo eliminar la orden'], 500);
    }
}

// ==================== RUTA DE ESTADÍSTICAS ====================

// GET /api/stats - Obtener estadísticas
if ($method === 'GET' && count($uri) >= 3 && $uri[2] === 'stats') {
    try {
        $userCount = $db->query("SELECT COUNT(*) as count FROM users")->fetch()['count'];
        $bookCount = $db->query("SELECT COUNT(*) as count FROM books")->fetch()['count'];
        $orderCount = $db->query("SELECT COUNT(*) as count FROM orders")->fetch()['count'];
        $revenue = $db->query("SELECT SUM(total_amount) as total FROM orders WHERE status != 'cancelled'")->fetch()['total'] ?? 0;

        sendResponse([
            'total_users' => (int)$userCount,
            'total_books' => (int)$bookCount,
            'total_orders' => (int)$orderCount,
            'total_revenue' => (float)$revenue
        ]);
    } catch (Exception $e) {
        sendResponse(['error' => 'Error al obtener estadísticas'], 500);
    }
}

// Si no coincide con ninguna ruta
sendResponse(['error' => 'Ruta no encontrada'], 404);
