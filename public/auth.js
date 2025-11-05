// File: public/auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut,
    signInAnonymously,
    GoogleAuthProvider,
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc 
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// --- Konfigurasi Firebase (HANYA DI SINI) ---
const firebaseConfig = {
  apiKey: "AIzaSyBZpVN-dFVngkxe6obg3hCeKyPniJb0__Y", // Ganti dengan key Anda
  authDomain: "project-1-lebih-baik.firebaseapp.com",
  projectId: "project-1-lebih-baik",
  storageBucket: "project-1-lebih-baik.firebasestorage.app",
  messagingSenderId: "153004966709",
  appId: "1:153004966709:web:9f98e0ba16ae35b18ec27c"
};

// --- Inisialisasi (Anti-Duplikat) ---
let app, auth, db, googleProvider;
try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  if (window.firebase?.apps?.length) {
    app = window.firebase.app();
  } else {
    console.error("Gagal inisialisasi Firebase:", e);
  }
}

if (app) {
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
}

const BACKEND_URL = ""; // URL API relatif

// --- Fungsi Bantuan Auth ---

// Fungsi sinkronisasi
async function syncUserWithBackend(user, nama) {
    try {
        const token = await user.getIdToken(true); 
        sessionStorage.setItem('firebaseIdToken', token);
        
        await fetch(`${BACKEND_URL}/api/v1/auth/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                email: user.email,
                nama: nama || user.displayName || 'User Baru'
            })
        });
    } catch (error) {
        console.error("Error saat sinkronisasi user:", error); 
    }
}

// Fungsi mengambil token (digunakan di halaman tool)
export async function getAuthToken() {
    if (!auth) return null;
    await auth.authStateReady(); 
    const user = auth.currentUser;
    if (!user || user.isAnonymous) {
        alert("Anda harus login dulu untuk mengakses halaman ini.");
        window.location.href = "index.html"; // Arahkan kembali ke home
        return null;
    }
    try {
        const token = await user.getIdToken(true); 
        sessionStorage.setItem('firebaseIdToken', token);
        return token;
    } catch (error) {
        console.error("Gagal mendapatkan token:", error);
        sessionStorage.removeItem('firebaseIdToken');
        window.location.href = 'index.html';
        return null;
    }
}

// --- Ekspor Fungsi Inti ---
export { 
    auth, db, googleProvider,
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut,
    signInAnonymously,
    signInWithPopup,
    syncUserWithBackend,
    setDoc, 
    doc 
};