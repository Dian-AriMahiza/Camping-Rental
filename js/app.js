// Menangani proses login
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("api/login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => response.json())
    .then(data => {
        showNotification(data.message, data.success);
        if (data.success) {
            setTimeout(() => {
                window.location.href = "dashboard.html"; // Redirect ke dashboard
            }, 5000); // Tunggu 5 detik sebelum redirect
        }
    })
    .catch(error => console.error("Error:", error));
});

// Menangani proses pendaftaran
document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const birthDate = document.getElementById("birthDate").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const reenterPassword = document.getElementById("reenterPassword").value;

    if (password !== reenterPassword) {
        showNotification("Password tidak cocok.", false); // Notifikasi jika password tidak cocok
        return;
    }

    fetch("api/register.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: fullName,
            dob: birthDate,
            phone: phoneNumber,
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        showNotification(data.message, data.success);
        if (data.success) {
            setTimeout(() => {
                window.location.href = "index.html"; // Redirect ke login
            }, 3000); // Tunggu 3 detik sebelum redirect
        }
    })
    .catch(error => console.error("Error:", error));
});

// Fungsi untuk menampilkan notifikasi
function showNotification(message, success) {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');
    messageElement.innerText = message;
    notification.style.backgroundColor = success ? "#4CAF50" : "#f44336"; // Hijau untuk sukses, merah untuk gagal
    notification.style.display = 'block';

    // Menghilangkan notifikasi setelah 5 detik
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// Fungsi untuk menambahkan item ke keranjang
function addToCart(itemName, buttonElement) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Cek apakah item sudah ada di keranjang
    const existingItem = cartItems.find(item => item.name === itemName);
    if (existingItem) {
        existingItem.quantity += 1;  // Tambah jumlah jika sudah ada
    } else {
        cartItems.push({ name: itemName, quantity: 1 });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    showAddToCartNotification(itemName + ' has been added to your cart.');
    updateCartBadge(); // Update cart badge after adding an item
}

// Update jumlah item di badge keranjang
function updateCartBadge() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartBadge = document.getElementById('cart-badge');
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    if (cartBadge) {
        cartBadge.innerText = totalItems;
    }
}

// Fungsi untuk menampilkan notifikasi penambahan item
function showAddToCartNotification(message) {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');
    messageElement.innerText = message;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000);
}

// Fungsi untuk menampilkan isi keranjang di MyCart atau Profile
function displayCart() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartList = document.getElementById('cart-list');

    // Kosongkan list cart sebelum menambahkan item baru
    cartList.innerHTML = '';

    // Tampilkan setiap item dalam cart
    cartItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.textContent = `${item.name} (x${item.quantity})`;
        cartList.appendChild(listItem);
    });

    // Update badge cart setelah menampilkan cart
    updateCartBadge();
}

// Panggil fungsi displayCart saat halaman dimuat
window.onload = function() {
    displayCart();
    updateCartBadge(); // Pastikan badge keranjang diperbarui saat halaman dimuat
};

// Event listener untuk tombol "Add to Cart" dengan class .btn-success
document.querySelectorAll('.btn-success').forEach(button => {
    button.addEventListener('click', (e) => {
        const itemName = e.target.closest('.card').querySelector('.card-title').innerText;
        addToCart(itemName, e.target);  // Kirimkan tombol yang diklik
    });
});
