// =================Importaciones==============
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const UsuarioModel = require('../models/usuarioModel');


// =================Se incializan servicios==============
const app = express();


app.post('/login', (req, res) => {

    let body = req.body;

    UsuarioModel.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o Contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (Contraseña) incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB,
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        return res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });



});








module.exports = app;