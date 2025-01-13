// Fungsi untuk menampilkan notifikasi
function showNotification(message) {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');
    messageElement.innerText = message;
    notification.style.display = 'block';

    // Menghilangkan notifikasi setelah 2 detik
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
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

// Fungsi untuk menangani submit form dan menampilkan notifikasi
document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Mencegah pengiriman form default

    // Mengambil data dari form
    const name = this.name.value;
    const dob = this.dob.value;
    const phone = this.phone.value;
    const email = this.email.value;
    const password = this.password.value;
    const confirmPassword = this.confirmPassword.value;

    // Validasi sisi klien
    if (!isValidEmail(email)) {
        showNotification("Format email tidak valid.");
        return;
    }
    if (!isValidPassword(password)) {
        showNotification("Password harus terdiri dari minimal 8 karakter, satu huruf besar, satu angka, satu simbol, dan tanpa spasi.");
        return;
    }
    if (password !== confirmPassword) {
        showNotification("Password tidak cocok.");
        return;
    }

    // Melakukan fetch ke API register
    fetch('api/register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'name': name,
            'dob': dob,
            'phone': phone,
            'email': email,
            'password': password,
            'confirm_password': confirmPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        showNotification(data.message); // Menampilkan notifikasi
        if (data.success) {
            setTimeout(() => {
                window.location.href = 'index.html'; // Arahkan ke halaman login
            }, 2000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification("Terjadi kesalahan. Silakan coba lagi.");
    });
});

// Menambahkan event listener untuk ikon mata
document.getElementById("togglePassword").addEventListener("click", function() {
    const passwordField = document.getElementById("password");
    const type = passwordField.type === "password" ? "text" : "password";
    passwordField.type = type;
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
});

document.getElementById("toggleConfirmPassword").addEventListener("click", function() {
    const confirmPasswordField = document.getElementById("confirmPassword");
    const type = confirmPasswordField.type === "password" ? "text" : "password";
    confirmPasswordField.type = type;
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
});
