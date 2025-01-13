<?php
// file update_profile.php
include 'config.php';
session_start();

// Pastikan user_id tersedia di session
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Ambil data yang di-post untuk diperbarui
$name = $_POST['name'];
$email = $_POST['email'];
$password = $_POST['password'];
$phone = $_POST['phone'];
$dob = $_POST['dob'];

// Jika password tidak kosong, hash dan perbarui password
if (!empty($password)) {
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $sql = "UPDATE users SET name = ?, email = ?, password = ?, phone = ?, dob = ? WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$name, $email, $hashed_password, $phone, $dob, $user_id]);
} else {
    $sql = "UPDATE users SET name = ?, email = ?, phone = ?, dob = ? WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$name, $email, $phone, $dob, $user_id]);
}

// Cek apakah update berhasil
if ($stmt->rowCount() > 0) {
    echo json_encode(["success" => "Profile berhasil diperbarui"]);
} else {
    // Jika tidak ada perubahan (misalnya name dan email sudah sama)
    echo json_encode(["error" => "Tidak ada perubahan yang terdeteksi atau kesalahan memperbarui profil"]);
}

$stmt = null; // Menutup statement
$pdo = null; // Menutup koneksi database
?>
