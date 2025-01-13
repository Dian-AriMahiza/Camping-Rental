<?php
// login.php
require 'config.php';

session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $password = trim($_POST['password']);
    $recaptchaResponse = $_POST['g-recaptcha-response'];

    // Validate inputs
    if (empty($email) || empty($password) || empty($recaptchaResponse)) {
        echo json_encode(["success" => false, "message" => "Email, password, and reCAPTCHA diperlukan."]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "Format email tidak valid."]);
        exit;
    }

    // Verify reCAPTCHA
    $recaptchaSecret = '6LdccpEqAAAAAJRwwXaiGS9795Y1UL8elqL90Uni';
    $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$recaptchaSecret&response=$recaptchaResponse");
    $responseKeys = json_decode($response, true);
    if (intval($responseKeys["success"]) !== 1) {
        echo json_encode(["success" => false, "message" => "Verifikasi reCAPTCHA gagal. Silakan coba lagi."]);
        exit;
    }

    // Check user in database
    try {
        $sql = "SELECT * FROM users WHERE email = :email";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Check if user is locked out
            if ($user['login_attempts'] >= 3) {
                $lastFailedLogin = new DateTime($user['last_failed_login']);
                $now = new DateTime();
                $diff = $now->diff($lastFailedLogin);

                if ($diff->i < 1) {  // Lockout period of 1 minute
                    echo json_encode(["success" => false, "message" => "Terlalu banyak upaya gagal. Mohon tunggu " . (60 - $diff->s) . " seconds."]);
                    exit;
                } else {
                    // Reset login attempts if cooldown period passed
                    $sql = "UPDATE users SET login_attempts = 0 WHERE email = :email";
                    $stmt = $pdo->prepare($sql);
                    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
                    $stmt->execute();
                }
            }

            // Verify password
            if (password_verify($password, $user['password'])) {
                // Login successful
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['email'] = $user['email'];
                echo json_encode(["success" => true, "message" => "Login berhasil!"]);

                // Reset login attempts on successful login
                $sql = "UPDATE users SET login_attempts = 0 WHERE email = :email";
                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(':email', $email, PDO::PARAM_STR);
                $stmt->execute();
            } else {
                // Incorrect password
                $sql = "UPDATE users SET login_attempts = login_attempts + 1, last_failed_login = NOW() WHERE email = :email";
                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(':email', $email, PDO::PARAM_STR);
                $stmt->execute();

                echo json_encode(["success" => false, "message" => "Email atau password salah."]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Email atau password salah."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Database query failed: " . $e->getMessage()]);
    }

    $pdo = null;
} else {
    echo json_encode(["success" => false, "message" => "Metode permintaan tidak valid."]);
}

?>
