<?php
// config.php

// Konfigurasi database
$host = 'sql310.infinityfree.com'; // Host database
$dbname = 'if0_37842820_camping_rental'; // Nama database Anda
$user = 'if0_37842820'; // Username database
$password = 'Ariariari27'; // Password untuk database

try {
    // Membuat koneksi ke database menggunakan PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);

    // Menetapkan mode error untuk PDO
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Menangani kesalahan dan mencatatnya ke file log
    error_log("Koneksi Gagal: " . $e->getMessage());
    die("Sambungan database gagal. Silakan coba lagi nanti.");
}

// Fungsi untuk menutup koneksi secara otomatis
function closeConnection($pdo)
{
    if ($pdo) {
        $pdo = null; // Menutup koneksi PDO
    }
}
?>