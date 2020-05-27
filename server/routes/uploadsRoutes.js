const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const path = require('path');
const fs = require('fs');

const UsuarioModel = require('../models/usuarioModel');
const ProductoModel = require('../models/productoModel');

// default options
app.use(fileUpload()); //----> Middleware.


app.put('/upload/:tipo/:id', function(req, res) {


    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    //Validar Tipo

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                tipo,
                message: 'No es un tipo permitido: ' + tiposValidos.join(',')
            }
        });
    }

    //Validar extension

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1]
    let extensionesValidas = ['png', 'gif', 'jpeg', 'jpg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                ext: extension,
                message: 'No es una imagen'
            }
        });
    }

    //Cambiar nombre Archivo
    let milisegundos = new Date().getMilliseconds();
    let nombreArchivo = `${ id }-${ milisegundos }.${ extension }`;

    //Mover archivo
    archivo.mv(path.resolve(__dirname, `../uploads/${ tipo }/${nombreArchivo}`), function(err) {
        //archivo.mv('uploads/filename.jpg', function(err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'al mover imagen',
                err
            });
        }
        //----->Aqui ya se cargo al filesystem
        if (tipo === 'usuarios') imagenUsusario(id, res, nombreArchivo);
        if (tipo === 'productos') imagenProducto(id, res, nombreArchivo);

    });

});



function imagenUsusario(id, res, archivo) {

    UsuarioModel.findById(id, (err, usuarioDB) => {

        if (err) {
            borrarImagen(archivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                message: 'al buscar usuario',
                err
            });
        }

        if (!usuarioDB) {
            borrarImagen(archivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'no existe el usuario'
                }
            });
        }

        borrarImagen(usuarioDB.img, 'usuarios');

        usuarioDB.img = archivo;

        usuarioDB.save((err, usuarioActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'al grabar el usuario',
                    err
                });
            }

            res.json({
                ok: true,
                usuarioActualizado
            });

        });





    });
}

function imagenProducto(id, res, archivo) {

    ProductoModel.findById(id, (err, productoDB) => {
        if (err) {
            borrarImagen(archivo, 'productos');
            return res.status(500).json({
                ok: false,
                message: 'al buscar producto',
                err
            });
        }

        if (!productoDB) {
            borrarImagen(archivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'no existe el producto'
                }
            });
        }

        borrarImagen(productoDB.img, 'productos');

        productoDB.img = archivo;

        productoDB.save((err, productoActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'al grabar el producto',
                    err
                });
            }

            res.json({
                ok: true,
                productoActualizado
            });

        });

    });

}


function borrarImagen(nombreArchivo, tipo) {
    //Validar que archivo exista:
    let pathURL = path.resolve(__dirname, `../uploads/${ tipo }/${ nombreArchivo}`);
    if (fs.existsSync(pathURL)) {
        fs.unlinkSync(pathURL)
    }
}
module.exports = app;