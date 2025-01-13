<?php
// register.php
require 'config.php'; // Pastikan ini mengarah ke file config.php yang benar

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Ambil data dari formulir dan sanitasi input
    $name = filter_var(trim($_POST['name']), FILTER_SANITIZE_STRING);
    $dob = filter_var(trim($_POST['dob']), FILTER_SANITIZE_STRING);
    $phone = filter_var(trim($_POST['phone']), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $password = trim($_POST['password']);
    $confirm_password = trim($_POST['confirm_password']);

    // Validasi input
    if (empty($name) || empty($dob) || empty($phone) || empty($email) || empty($password) || empty($confirm_password)) {
        echo json_encode(["success" => false, "message" => "Semua kolom wajib diisi."]);
        exit; // Keluar dari skrip jika input tidak valid
    }

    // Cek apakah password cocok
    if ($password !== $confirm_password) {
        echo json_encode(["success" => false, "message" => "Password tidak cocok."]);
        exit;
    }

    // Cek format email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "Format email tidak valid."]);
        exit;
    }

    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    try {
        // Cek apakah email sudah terdaftar
        $checkEmailQuery = "SELECT * FROM users WHERE email = :email";
        $stmt = $pdo->prepare($checkEmailQuery);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(["success" => false, "message" => "Email sudah terdaftar."]);
            exit;
        }

        // Simpan ke database
        $sql = "INSERT INTO users (name, dob, phone, email, password) VALUES (:name, :dob, :phone, :email, :password)";
        $stmt = $pdo->prepare($sql);

        // Bind parameter dan eksekusi query
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':dob', $dob, PDO::PARAM_STR);
        $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':password', $hashed_password, PDO::PARAM_STR);

        // Eksekusi query
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Akun berhasil didaftarkan!"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error: " . $stmt->errorInfo()[2]]);
        }
    } catch (PDOException $e) {
        // Tangani kesalahan query database
        echo json_encode(["success" => false, "message" => "Database query failed: " . $e->getMessage()]);
    }

    // Menutup koneksi
    $pdo = null;
} else {
    echo json_encode(["success" => false, "message" => "Metode permintaan tidak valid."]);
}
?>
