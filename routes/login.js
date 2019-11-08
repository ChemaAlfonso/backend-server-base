var express = require('express');
var app = express();

// Bcrypt
var bcrypt = require('bcryptjs');

// JWT
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// =============================
// Importar modelo de usuario
// =============================
var Usuario = require('../models/usuario');


app.post('/', ( req, res ) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, ( err, usuarioDb ) => {
    
        if ( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            }); 
        }

        if( !usuarioDb ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            }); 
        }

        if( !bcrypt.compareSync( body.password, usuarioDb.password) ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - pass',
                errors: err
            }); 
        }

        // Crear un token
        usuarioDb.password = ':)';
        let token = jwt.sign({ usuario: usuarioDb }, SEED,{ expiresIn: 14400 }); // 4 horas
        
        res.status(200).json({
            ok: true,
            usuario: usuarioDb,
            id: usuarioDb._id,
            token
        });

    });
})

module.exports = app;