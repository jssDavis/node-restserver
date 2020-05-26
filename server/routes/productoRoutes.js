// =================Importaciones==============
const express = require('express');
const _ = require('underscore');

const { verificaToken } = require('../middlewares/autentication');

const ProductoModel = require('../models/productoModel');
// =================Se incializan servicios==============
const app = express();

// =================Código==============


//Obtener Todos los productos

app.get('/producto', [verificaToken], (req, resp) => {

    let desde = req.query.desde || 0; //Los parametros opcionales vienen en el "query" de la peticion ejemplo: /usuario?desde=10
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    ProductoModel.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort('descripcion')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    err
                });

            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Categoria no encontrada'
                    }
                });
            }



            resp.json({
                ok: true,
                productoDB
            });

        });


});


//Obtener producto por ID

app.get('/producto/:id', [verificaToken], (req, res) => {

    let id = req.params.id;

    ProductoModel.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });

            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                productoDB
            });

        });





});



//Buscar Productos

app.get('/producto/buscar/:termino', [verificaToken], (req, res) => {

    let termino = req.params.termino;
    let regexp = new RegExp(termino, 'i');

    ProductoModel.find({ nombre: regexp })
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });

            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                productoDB
            });

        });
});



//Crear un producto 

app.post('/producto', [verificaToken], (req, resp) => {
    let body = req.body;

    let producto = new ProductoModel({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                err
            });

        }



        resp.json({
            ok: true,
            productoDB
        });
    });


});

//Actualizar un producto 

app.put('/producto/:id', [verificaToken], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    // let productoActualizar = {
    //     nombre: body.nombre,
    //     precioUni: body.precioUni,
    //     descripcion: body.descripcion,
    //     disponible: body.disponible,
    //     categoria: body.categoria,
    //     usuario: req.usuario.id
    // };


    // ProductoModel.findByIdAndUpdate(id, productoActualizar, { new: true /*, runValidators: true*/ }, (err, productoDB) => {


    //     if (err) {
    //         return res.status(500).json({
    //             ok: false,
    //             err
    //         });

    //     }

    //     if (!productoDB) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Producto no encontrado'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         productoDB
    //     });
    // });




    ProductoModel.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }


        productoDB.nombre = body.nombre || productoDB.nombre;
        productoDB.precioUni = body.precioUni || productoDB.precioUni;
        productoDB.descripcion = body.descripcion || productoDB.descripcion;
        productoDB.disponible = body.disponible || productoDB.disponible;
        productoDB.categoria = body.categoria || productoDB.categoria;
        productoDB.usuario = req.usuario._id || productoDB.usuario;

        productoDB.save((err, productoActualizadoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoActualizadoDB,
                message: 'Producto actualizado'
            });

        });




    });



});


// Eliminar un producto

app.delete('/producto/:id', [verificaToken], (req, res) => {

    let id = req.params.id;




    // let productoActualizar = {
    //     disponible: false
    // };

    // ProductoModel.findByIdAndUpdate(id, productoActualizar, { new: true /*, runValidators: true*/ }, (err, productoDB) => {


    //     if (err) {
    //         return res.status(500).json({
    //             ok: false,
    //             err
    //         });

    //     }

    //     if (!productoDB) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Producto no encontrado'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         productoDB
    //     });
    // });


    ProductoModel.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }


        productoDB.disponible = false;


        productoDB.save((err, productoEliminadoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoEliminadoDB,
                message: 'Producto actualizado'
            });

        });




    });



});


// =================Exportar configuraciones==============

module.exports = app;