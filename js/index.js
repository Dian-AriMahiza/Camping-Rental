let failedLoginAttempts = 0; // Menghitung jumlah percobaan login yang gagal
let countdownActive = false; // Menandakan apakah countdown sedang berjalan

// Fungsi untuk menampilkan notifikasi dengan countdown
function showNotification(message, countdownTime = 2000) {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');

    if (notification.style.display === 'block') {
        return; // Tidak melakukan apa-apa jika notifikasi sudah aktif
    }

    messageElement.innerText = message;
    notification.style.display = 'block';

    if (countdownTime > 2000) {
        let countdown = countdownTime / 1000;
        const countdownInterval = setInterval(() => {
            messageElement.innerText = `${message} (${countdown}s)`;
            countdown--;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                notification.style.display = 'none';
            }
        }, 1000);
    } else {
        setTimeout(() => {
            notification.style.display = 'none';
        }, countdownTime);
    }
}

// Fungsi toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById("toggleIcon");

    if (input.type === "password") {
        input.type = "text";
        icon.className = "fas fa-eye"; // Ganti ikon ke mata terbuka
    } else {
        input.type = "password";
        icon.className = "fas fa-eye-slash"; // Ganti ikon ke mata tertutup
    }
}

// Fungsi validasi format email
function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

// Fungsi validasi password
function isValidPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[^\s]{8,}$/;
    return regex.test(password);
}

// Fungsi untuk menangani submit form login
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Mencegah pengiriman form default

    const email = this.email.value;
    const password = this.password.value;
    const recaptchaResponse = grecaptcha.getResponse();

    // Pastikan countdown tidak aktif atau data login valid
    if (countdownActive && failedLoginAttempts >= 3) {
        showNotification("Harap tunggu selama 1 menit sebelum mencoba lagi.", 3000);
        return;
    }

    if (!isValidEmail(email)) {
        showNotification("Format email tidak valid.", 3000);
        return;
    }

    if (!isValidPassword(password)) {
        showNotification("Password harus terdiri dari minimal 8 karakter, satu huruf besar, satu angka, satu simbol, dan tanpa spasi.", 3000);
        return;
    }

    if (!recaptchaResponse) {
        showNotification("Mohon selesaikan tahap reCAPTCHA.", 3000);
        return;
    }

    fetch('api/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'email': email,
            'password': password,
            'g-recaptcha-response': recaptchaResponse
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Respons jaringan tidak baik ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                failedLoginAttempts = 0; // Reset jumlah percobaan gagal
                countdownActive = false; // Pastikan countdown nonaktif
                showNotification(data.message, 2000);
                setTimeout(() => {
                    window.location.href = 'dashboard.html'; // Arahkan ke halaman dashboard
                }, 2000);
            } else {
                failedLoginAttempts++;
                if (failedLoginAttempts >= 3) {
                    countdownActive = true; // Aktifkan countdown
                    showNotification("Terlalu banyak percobaan. Mohon tunggu selama 1 menit.", 60000);
                    document.getElementById("loginButton").disabled = true;

                    setTimeout(() => {
                        countdownActive = false; // Countdown selesai
                        document.getElementById("loginButton").disabled = false;
                    }, 60000);
                } else {
                    showNotification(data.message, 3000);
                }
                grecaptcha.reset(); // Reset reCAPTCHA
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification("Terjadi kesalahan. Silakan coba lagi. Error: " + error.message, 3000);
        });
});
