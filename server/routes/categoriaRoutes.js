// =================Importaciones==============
const express = require('express');
const _ = require('underscore');

const { verificaToken, verificaAdminRole } = require('../middlewares/autentication');

const CategoriaModel = require('../models/categoriaModel');
// =================Se incializan servicios==============
const app = express();

// =================Código==============



//--------Mostrar todas las cetegorias *Get

app.get('/categoria', verificaToken, (req, res) => {

    CategoriaModel.find({ estado: true }, 'descripcion usuario')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriasBD) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            CategoriaModel.countDocuments({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    conteo,
                    categoriasBD
                });
            });
        });


});


//--------Mostrar categoria por iD *Get

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    CategoriaModel.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });




    });


});

//--------Crear Categoria *Pos => Regresa la nueva categoria

app.post('/categoria', [verificaToken, verificaAdminRole], (req, res) => {


    let body = req.body; //Se parsea con bodyParser como middleware

    let categoria = new CategoriaModel({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
        estado: body.estado
    });




    categoria.save((err, categoriaBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }



        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //usuarioDB.password = null;

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });

});

//--------Actualizar Categoria *Put => Regresa la nueva categoria.

app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    //let body = req.body; //Se parsea con bodyParser como middleware
    let id = req.params.id

    let body = _.pick(req.body, ['descripcion', 'estado']);

    // let categoria = new CategoriaModel({
    //     descripcion: body.descripcion
    // });

    CategoriaModel.findByIdAndUpdate(id, body, { new: true /*, runValidators: true*/ }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });



    });


});


//--------Borrar Categoria *Delete => Sólo un administrador puede borrar 


app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id

    CategoriaModel.findByIdAndRemove(id, (err, categoriaBorradaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorradaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorradaDB
        });



    });


});



// =================Exportación==============

module.exports = app;