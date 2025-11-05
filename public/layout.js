// File: public/layout.js
document.addEventListener("DOMContentLoaded", () => {
    const navPlaceholder = document.getElementById("nav-placeholder");
    if (navPlaceholder) {
        fetch('_nav.html')
            .then(response => response.ok ? response.text() : Promise.reject('_nav.html not found'))
            .then(data => {
                navPlaceholder.innerHTML = data;
                // Inisialisasi semua fungsionalitas header
                initHeader(); 
                lucide.createIcons(); // Render ikon di nav
            })
            .catch(error => console.error("Gagal memuat navigasi:", error));
    }
});

function initHeader() {
    // 1. Logika Scroll Glassmorphism (dari index.html)
    const header = document.getElementById('header'); // Ini sekarang ada di dalam placeholder
    if (header) {
        // Cek apakah kita di index.html, hanya terapkan scroll jika di home
        const path = window.location.pathname;
        if (path === '/' || path.endsWith('index.html')) {
             // Terapkan gaya 'fixed' untuk home
            header.classList.add('fixed');
            header.classList.remove('sticky', 'glassmorphism', 'shadow-lg'); // Hapus gaya sticky jika ada
            
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('glassmorphism', 'shadow-lg');
                } else {
                    header.classList.remove('glassmorphism', 'shadow-lg');
                }
            });
        } else {
            // Terapkan gaya 'sticky' untuk semua halaman lain
            header.classList.add('sticky', 'glassmorphism', 'shadow-lg');
            header.classList.remove('fixed');
        }
    }

    // 2. Logika Mobile Menu (dari index.html)
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 3. Tambahkan listener ke tombol login/logout di nav yang baru dimuat
    // Kita harus panggil fungsi ini DARI DALAM <script type="module"> halaman utama
    // karena tombol login/logout terikat dengan logika auth di sana.
    if (typeof window.initAuthButtons === 'function') {
        window.initAuthButtons();
    }
}