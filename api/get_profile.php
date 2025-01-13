<?php
// get_profile.php
session_start();
require 'config.php';

// Cek apakah user sudah login
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "Pengguna tidak masuk."]);
    exit();
}

$user_id = $_SESSION['user_id']; // Ambil user_id dari session

try {
    // Query untuk mengambil data profil user berdasarkan user_id
    $sql = "SELECT name, email, password, phone, dob FROM users WHERE id = :user_id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        // Ambil data profil user
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($user);
    } else {
        echo json_encode(["error" => "Pengguna tidak ditemukan."]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}

$pdo = null;
?>