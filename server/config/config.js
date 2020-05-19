// ======================
// Puerto
// ======================
process.env.PORT = process.env.PORT || 3000; // Para local o produccion



// ======================
// Entorno
// ======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; // Para local o produccion


// ======================
// Base de Datos
// ======================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;