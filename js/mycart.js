//mycart.js
let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

function showNotification(message) {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');
    messageElement.innerText = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

function showSuccessMessage() {
    document.querySelector('.container').style.display = 'none';
    document.getElementById('success-container').style.display = 'block';
    loadMap();
}

function togglePlaceOrderButton() {
    const placeOrderButton = document.getElementById('place-order-btn');
    if (cart.length === 0) {
        placeOrderButton.disabled = true; // Nonaktifkan tombol jika keranjang kosong
    } else {
        placeOrderButton.disabled = false; // Aktifkan tombol jika ada barang
    }
}

function loadMap() {
    const map = L.map('map').setView([-7.831470, 110.383023], 20); // Koordinat Lokasi Toko
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([-7.831470, 110.383023]).addTo(map).bindPopup('Lokasi Toko').openPopup();

    // Pastikan peta melakukan resize setelah elemen dimuat dengan benar
    setTimeout(() => {
        map.invalidateSize();
    }, 4000);  // Cobalah interval yang lebih panjang
}

function checkout() {
    showNotification("Pesananmu direkam!");
    localStorage.removeItem('cartItems');
    cart = [];
    updateCartBadge();
    document.getElementById('cart-list').innerHTML = ''; // Clear cart display
    setTimeout(() => {
        showSuccessMessage(); // Tampilkan pesan sukses dan peta
    }, 2000); // Delay untuk memberikan waktu notifikasi muncul
}

// Di mycart.js, setelah update cart
function updateCartBadge() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        cartBadge.innerText = totalItems; // Menampilkan jumlah total item di badge
    }
}

function removeFromCart(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    localStorage.setItem('cartItems', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
    togglePlaceOrderButton(); // Update status tombol
}

function renderCart() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = ''; // Clear existing list
    cart.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerText = `${item.name} (x${item.quantity})`;

        // Create Remove Button
        const removeButton = document.createElement('button');
        removeButton.className = 'btn btn-danger btn-sm';
        removeButton.innerText = 'Remove';
        removeButton.onclick = () => removeFromCart(item.name);

        li.appendChild(removeButton);
        cartList.appendChild(li);
    });
    togglePlaceOrderButton(); // Update status tombol setelah render
}

// Load cart items and render them when the page loads
window.onload = function() {
    renderCart();
    updateCartBadge();
    togglePlaceOrderButton(); // Set tombol sesuai isi keranjang saat halaman dimuat
    setTimeout(loadMap, 200); // Delay kecil sebelum peta dimuat
};

function logout() {
    // Menghapus data cart (jika ada)
    localStorage.removeItem('cartItems');

    // Menghapus data sesi (jika ada)
    localStorage.removeItem('userSession');  // Misalnya, jika Anda menyimpan data pengguna di localStorage
    
    // Menampilkan notifikasi logout
    showNotification("Berhasil Logout");

    // Mengalihkan pengguna ke halaman login (index.html)
    setTimeout(() => {
        window.location.href = 'index.html'; // Halaman login
    }, 2000); // Mengarahkan setelah 2 detik untuk memberikan waktu bagi notifikasi
}