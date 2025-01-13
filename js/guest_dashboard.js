//
// Fungsi untuk menampilkan notifikasi
function showGuestNotification(message) {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');
    messageElement.innerText = message;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

// Event listener untuk tombol "Add to Cart"
document.getElementById('equipment-list').addEventListener('click', (event) => {
    if (event.target.classList.contains('add-to-cart')) {
        // Tampilkan notifikasi
        showGuestNotification('Login untuk mengaktifkan keranjang.');

        // Arahkan ke halaman login
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
});
//
// Fungsi untuk menampilkan notifikasi
function showGuestNotification(message) {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');
    messageElement.innerText = message;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

// Event listener untuk tombol "Add to Cart"
document.getElementById('equipment-list').addEventListener('click', (event) => {
    if (event.target.classList.contains('add-to-cart')) {
        // Tampilkan notifikasi
        showGuestNotification('Login untuk mengaktifkan keranjang.');

        // Arahkan ke halaman login
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
});
