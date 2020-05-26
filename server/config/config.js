// ======================
// Puerto
// ======================
process.env.PORT = process.env.PORT || 3000; // Para local o produccion



// ======================
// Entorno
// ======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; // Para local o produccion


// ======================
// Vencimiento del Token
// ======================

process.env.CADUCIDAD_TOKEN = '48h' //60 * 60 * 24 * 30



// ======================
// SEED de autenticación
// ======================

process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo'


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



// ======================
// Google Client ID
// ======================

process.env.CLIENT_ID = process.env.CLIENT_ID || '748366191767-td08894367hrtv0iaitd64t4mun2g28f.apps.googleusercontent.com';