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
    urlDB = 'mongodb+srv://cafe-user:Y8jpJ6tgtTbwgkDG@cluster0-clkir.mongodb.net/cafe'
}

process.env.URLDB = urlDB;