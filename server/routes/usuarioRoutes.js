// =================Importaciones==============
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const UsuarioModel = require('../models/usuarioModel');
const { verificaToken, verificaAdminRole } = require('../middlewares/autentication');


// =================Se incializan servicios==============
const app = express();



// =================Rutas que seran expuestas y cosumidas por PostMan==============


// ----------------GET

app.get('/usuario', verificaToken, function(req, res) {

    // return res.json({
    //     peticion: ' get usuario ',
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // });

    let desde = req.query.desde || 0; //Los parametros opcionales vienen en el "query" de la peticion ejemplo: /usuario=desde=10
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    UsuarioModel.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            UsuarioModel.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    conteo,
                    usuarios
                });
            });
        });



})


// ----------------POST
app.post('/usuario', [verificaToken, verificaAdminRole], function(req, res) {

    // return res.json({
    //     peticion: ' post usuario ',
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // });



    let body = req.body; //Se parsea con bodyParser como middleware

    let usuario = new UsuarioModel({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });


    });

})


// ----------------PUT
app.put('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {

    // return res.json({
    //     peticion: ' put usuario ',
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // });

    let id = req.params.id;
    // let body = req.body; //Se parsea con bodyParser como middleware
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    UsuarioModel.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });


    });




})





// // ----------------DELETE FISICO
// app.delete('/usuario/:id', function(req, res) {

//     let id = req.params.id;

//     UsuarioModel.findByIdAndRemove(id, (err, usuarioBorrado) => {

//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             });
//         }

//         if (!usuarioBorrado) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     message: 'Usuario no encontrado'
//                 }
//             });
//         }

//         res.json({
//             ok: true,
//             usuario: usuarioBorrado
//         });

//     });



// })




// ----------------DELETE LOGICO
app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {

    // return res.json({
    //     peticion: ' delete usuario ',
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // });


    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }


    UsuarioModel.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });


    });




})


module.exports = app;