var express = require('express');
var app = express();

// Bcrypt
var bcrypt = require('bcryptjs');

// JWT
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// Google
const {OAuth2Client} = require('google-auth-library');
var CLIENT_ID = require('../config/config').CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

// =============================
// Importar modelo de usuario
// =============================
var Usuario = require('../models/usuario');

// ======================================
//  Login Google
// ======================================  
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];


    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}

app.post('/google', async (req, res) => {

    var token = req.body.token;
    var googleUser = await verify( token )
        .catch( err => {
            return res.status(500).json({
                ok: false,
                mensaje: 'Token no válido',
                errors: err
            }); 
        });

    Usuario.findOne( { email: googleUser.email }, (err, usuarioDb) => {
        if ( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            }); 
        }

        if ( usuarioDb ){

            if( !usuarioDb.google ){
                
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario registrado mediante autentificación local',
                    errors: err
                }); 

            } else {
                usuarioDb.password = ':)';
                let token = jwt.sign({ usuario: usuarioDb }, SEED,{ expiresIn: 14400 }); // 4 horas
                
                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDb,
                    id: usuarioDb._id,
                    token
                });
            }

        } else {
            // Usuario no existe
            var usuario = new Usuario();
            usuario.nombre    = googleUser.nombre;
            usuario.apellidos = googleUser.nombre;
            usuario.email     = googleUser.email;
            usuario.img       = googleUser.img;
            usuario.google    = true;
            usuario.password  = ':)';

            usuario.save( (err, usr) => {
                if ( err ){
                    res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar usuarios',
                        errors: err
                    }); 
                }
                let token = jwt.sign({ usuario: usr }, SEED,{ expiresIn: 14400 }); // 4 horas
                
                res.status(200).json({
                    ok: true,
                    usuario: usr,
                    token
                });
            });
        }
    });

});



// ======================================
//  Login local
// ======================================
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