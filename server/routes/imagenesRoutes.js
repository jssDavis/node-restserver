const express = require('express');
const app = express();
const { verificaTokenImg } = require('../middlewares/autentication');


const path = require('path');
const fs = require('fs');


app.get('/imagen/:tipo/:img', [verificaTokenImg], (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let imageURL = path.resolve(__dirname, `../uploads/${ tipo }/${img}`);

    if (!fs.existsSync(imageURL)) {
        return res.sendFile(path.resolve(__dirname, `../assets/image.jpg`));
    } else {

        res.sendFile(imageURL);

    }

});

module.exports = app;