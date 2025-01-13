// Menampilkan notifikasi penambahan item
function showAddToCartNotification(message) {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');
    messageElement.innerText = message;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

// Menampilkan notifikasi logout
function showLogoutNotification() {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');
    messageElement.innerText = "Berhasil Logout";
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
        window.location.href = "index.html"; // Redirect ke halaman login
    }, 2000);
}

// Fungsi untuk menambahkan item ke keranjang
function addToCart(itemName) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Cek apakah item sudah ada di keranjang
    const existingItem = cartItems.find(item => item.name === itemName);
    if (existingItem) {
        existingItem.quantity += 1; // Tambah jumlah jika sudah ada
    } else {
        cartItems.push({ name: itemName, quantity: 1 }); // Tambahkan item baru
    }

    // Simpan data keranjang ke localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Perbarui badge keranjang setelah menambahkan item
    updateCartBadge();

    // Memicu event agar halaman lain memperbarui badge
    window.dispatchEvent(new Event('cartUpdated'));

    // Tampilkan notifikasi bahwa item berhasil ditambahkan
    showAddToCartNotification(itemName + ' telah ditambahkan ke keranjang.');

    // Perbarui tampilan mycart setelah menambahkan item
    updateMyCartDisplay();
}

// Update jumlah item di badge keranjang
function updateCartBadge() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartBadge = document.getElementById('cart-badge');

    // Hitung total semua item dalam keranjang
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    // Update badge dengan jumlah total item
    cartBadge.innerText = totalItems;
}

// Fungsi untuk mengelompokkan item berdasarkan nama
function groupCartItems(cartItems) {
    const groupedItems = {};

    cartItems.forEach(item => {
        if (groupedItems[item.name]) {
            groupedItems[item.name].quantity += item.quantity;
        } else {
            groupedItems[item.name] = { ...item };
        }
    });

    return Object.values(groupedItems);
}

// Fungsi untuk memperbarui tampilan mycart
function updateMyCartDisplay() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const groupedItems = groupCartItems(cartItems);
    const myCartElement = document.getElementById('mycart');

    myCartElement.innerHTML = ''; // Kosongkan elemen mycart

    groupedItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerText = `${item.name} (x${item.quantity})`;
        myCartElement.appendChild(itemElement);
    });
}

// Cek duplikasi listener dan tambahkan hanya satu kali
function setupAddToCartButtons() {
    document.querySelectorAll('.btn-success').forEach(button => {
        // Hapus semua listener sebelumnya
        button.replaceWith(button.cloneNode(true)); // Menghindari listener ganda
        
        // Tambahkan listener baru
        button.addEventListener('click', (e) => {
            const itemName = e.target.closest('.card').querySelector('.card-title').innerText;

            // Panggil fungsi addToCart untuk menambahkan item
            addToCart(itemName);
        });
    });
}

// Event listener untuk logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    // Hapus item dari keranjang di localStorage
    localStorage.removeItem('cartItems');
    showLogoutNotification(); // Tampilkan notifikasi logout
});

// Update the cart badge when the page loads
window.onload = function() {
    updateCartBadge(); // Memperbarui badge keranjang saat halaman dimuat
    setupAddToCartButtons(); // Pastikan tombol "Add to Cart" disiapkan
    updateMyCartDisplay(); // Perbarui tampilan mycart saat halaman dimuat
};