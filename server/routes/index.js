// =================Importaciones==============
const express = require('express')


// =================Se incializan servicios==============
const app = express();




//Codigo 

app.use(require('./usuarioRoutes.js'));
app.use(require('./loginRoutes.js'));
app.use(require('./categoriaRoutes.js'));
app.use(require('./productoRoutes.js'));


//Fin de codigo



//Exportar las configuraciones que se le hacen a app
module.exports = app;