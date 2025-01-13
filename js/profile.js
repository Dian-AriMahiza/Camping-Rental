// Function to show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerText = message;

    // Menambahkan notifikasi ke body
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000); // Menghapus notifikasi setelah 3 detik
}

// Toggle visibility of password
$('#toggle-password').click(function() {
    const passwordInput = $('#password');
    const icon = $(this).find('i');

    if (passwordInput.attr('type') === 'password') {
        passwordInput.attr('type', 'text'); // Ubah tipe input menjadi text
        icon.removeClass('fa-eye-slash').addClass('fa-eye'); // Ganti ikon mata
    } else {
        passwordInput.attr('type', 'password'); // Kembali ke tipe password
        icon.removeClass('fa-eye').addClass('fa-eye-slash'); // Ganti ikon mata
    }
});

// Fungsi validasi password
function isValidPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[^\s]{8,}$/;
    return regex.test(password);
}

// Update jumlah item di badge keranjang
function updateCartBadge() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        cartBadge.innerText = totalItems; // Menampilkan jumlah total item di badge
    }
}

// Event listener untuk cartUpdated event
document.addEventListener('cartUpdated', function() {
    updateCartBadge(); // Memperbarui badge keranjang saat ada perubahan
});

// Load profile data on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge(); // Pastikan badge diperbarui saat halaman dimuat
    loadProfile(); // Memuat data profil pengguna
});

// Fetch profile data from the server
function loadProfile() {
    $.ajax({
        url: 'api/get_profile.php', // Memanggil API untuk mengambil data profil
        type: 'GET',
        success: function(response) {
            const data = JSON.parse(response);
            if (data.error) {
                showNotification(data.error, 'error'); // Jika ada error, tampilkan notifikasi error
            } else {
                // Isi elemen dengan data dari database
                $('#display-username').text(data.name); // Tampilkan name sebagai username
                $('#display-email').text(data.email); // Tampilkan email
                $('#display-phone').text(data.phone); // Tampilkan phone
                $('#display-dob').text(data.dob); // Tampilkan tanggal lahir
                
                // Mengisi form edit untuk pengubahan profil
                $('#username').val(data.name); // Isi form dengan name
                $('#email').val(data.email);    // Isi form dengan email
                $('#phone').val(data.phone);    // Isi form dengan phone
                $('#dob').val(data.dob);        // Isi form dengan tanggal lahir
            }
        },
        error: function() {
            showNotification("Kesalahan mengambil data profil.", 'error');
        }
    });
}

// Toggle between display and edit form
$('#edit-btn').click(function() {
    $('#profile-display').hide();  // Sembunyikan tampilan profil
    $('#profile-edit').show();     // Tampilkan form edit
});

// Cancel button functionality
$('#cancel-btn').click(function() {
    $('#profile-display').show();  // Tampilkan tampilan profil
    $('#profile-edit').hide();     // Sembunyikan form edit
});

// Handle profile update form submission
$('#profile-form').submit(function(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    const name = $('#username').val();
    const email = $('#email').val();
    const password = $('#password').val();
    const phone = $('#phone').val();
    const dob = $('#dob').val();

    // Cek apakah password valid
    if (password && !isValidPassword(password)) {
        showNotification("Password tidak valid. Pastikan password memiliki min. 8 karakter, 1 huruf besar, 1 angka, dan 1 simbol.", 'error');
        return; // Hentikan proses jika password tidak valid
    }

    // Send updated profile data to the server
    $.ajax({
        url: 'api/update_profile.php',
        type: 'POST',
        data: {
            name: name,
            email: email,
            password: password,
            phone: phone,
            dob: dob
        },
        success: function(response) {
            const data = JSON.parse(response);
            if (data.success) {
                showNotification(data.success); // Show success notification
                loadProfile(); // Reload updated profile data
                $('#profile-display').show();  // Show the updated profile view
                $('#profile-edit').hide();     // Hide the edit form
            } else {
                showNotification(data.error, 'error'); // Show error notification
            }
        },
        error: function() {
            showNotification("Kesalahan memperbarui profil.", 'error');
        }
    });
});

// Logout function
function logout() {
    // Menghapus data cart (jika ada)
    localStorage.removeItem('cartItems');

    // Menghapus data sesi pengguna dari sessionStorage
    sessionStorage.removeItem('userSession');
    
    // Menampilkan notifikasi logout
    showNotification("Berhasil Logout");
    
    // Mengarahkan pengguna ke halaman login setelah 2 detik
    setTimeout(function() {
        window.location.href = 'index.html'; // Redirect ke halaman login
    }, 2000);
}
