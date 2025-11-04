// api/index.js

// Impor 'app' dari file backend/app.js Anda
const { app } = require('../backend/app.js');

// Ekspor app agar Vercel bisa menggunakannya
module.exports = app;