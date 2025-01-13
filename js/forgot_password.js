//file forgot_password.js
// Fungsi untuk menampilkan notifikasi
function showNotification(message) {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');
    messageElement.innerText = message;
    notification.style.display = 'block';

    // Menghilangkan notifikasi setelah 5 detik
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

document.addEventListener("DOMContentLoaded", function() {
    // Event listener untuk ikon mata
    const toggleIcons = document.querySelectorAll(".eye-icon");
    toggleIcons.forEach(icon => {
        icon.addEventListener("click", function() {
            const inputId = this.dataset.inputId;
            togglePassword(inputId, this);
        });
    });
});

// Fungsi untuk toggle password visibility
function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);

    if (input.type === "password") {
        input.type = "text";
        icon.querySelector("i").classList.remove("fa-eye-slash");
        icon.querySelector("i").classList.add("fa-eye");
    } else {
        input.type = "password";
        icon.querySelector("i").classList.remove("fa-eye");
        icon.querySelector("i").classList.add("fa-eye-slash");
    }
}

document.getElementById("resetPasswordForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = this.email.value;
    const name = this.name.value;
    const phone = this.phone.value;
    const newPassword = this.new_password.value;

    fetch('api/reset_password.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'email': email,
            'name': name,
            'phone': phone,
            'new_password': newPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification("Pengaturan ulang password berhasil! Silakan login lagi.");
            setTimeout(() => {
                window.location.href = 'index.html'; // Redirect to login page
            }, 2000);
        } else {
            showNotification(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification("An error occurred. Please try again.");
    });
});
