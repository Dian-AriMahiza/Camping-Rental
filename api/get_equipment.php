<?php
// get_equipment.php

require 'config.php';

header('Content-Type: application/json'); // Menetapkan header JSON untuk output

try {
    // Query untuk mengambil semua item rental
    $sql = "SELECT * FROM rental_items";
    $stmt = $pdo->query($sql); // Menggunakan PDO query

    $items = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $items[] = $row;
    }

    // Mengembalikan hasil sebagai JSON
    echo json_encode($items);
} catch (PDOException $e) {
    // Menangani kesalahan dan mengirimkan pesan error dalam format JSON
    echo json_encode(['error' => 'Failed to fetch rental items', 'message' => $e->getMessage()]);
} finally {
    // Menutup koneksi PDO jika ada
    closeConnection($pdo);
}
?>