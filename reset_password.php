<?php
// reset_password.php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $name = trim($_POST['name']);
    $phone = trim($_POST['phone']);
    $newPassword = trim($_POST['new_password']);

    // Validasi input
    if (empty($email) || empty($name) || empty($phone) || empty($newPassword)) {
        echo json_encode(["success" => false, "message" => "Email, nama, nomor telepon, dan password baru diperlukan."]);
        exit;
    }

    // Cek format email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "Format email tidak valid."]);
        exit;
    }

    try {
        // Query untuk memverifikasi email, nama, dan nomor telepon
        $sql = "SELECT * FROM users WHERE email = :email AND name = :name AND phone = :phone";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Update password baru
            $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
            $updateSql = "UPDATE users SET password = :password WHERE email = :email";
            $updateStmt = $pdo->prepare($updateSql);
            $updateStmt->bindParam(':password', $hashedPassword);
            $updateStmt->bindParam(':email', $email);
            $updateStmt->execute();

            echo json_encode(["success" => true, "message" => "Password berhasil diperbarui."]);
        } else {
            echo json_encode(["success" => false, "message" => "Email, nama, dan nomor telepon tidak cocok."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
}
?>
