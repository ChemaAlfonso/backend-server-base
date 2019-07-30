var express = require('express');

var app = express();

// Bcrypt
var bcrypt = require('bcryptjs');

// =============================
// Importar modelo de usuario
// =============================
var Usuario = require('../models/usuario');

// =============================
// Obtener todos los usuarios
// =============================
app.get('/', (req, res, next) => {
    //Especificación de columnas
    Usuario.find({}, 'nombre apellidos email img role')
        //Ejecutamos la consulta
        .exec(
            ( err, usrs ) => {

                if ( err ){
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar usuarios',
                        errors: err
                    }); 
                }

                res.status(200).json({
                    ok: true,
                    usuarios: usrs
                });

    });

    

});

// =============================
// Actualizar usuario
// =============================
app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, ( err, usuario ) => {        

        if ( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            }); 
        }

        if (!res){
            return res.status(400).json({
                ok: false,
                mensaje: 'En usuario con el id ' + id + ' no existe.',
                errors: {message: 'No existe un usuario con ese id'}
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save( (err, usuarioGuardado ) => {
            if ( err ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuarios',
                    errors: err
                }); 
            }

            usuarioGuardado.password = ':)';
            
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });
        

    });

});

// =============================
// Crear nuevo usuario
// =============================
app.post('/', ( req, res ) => {

    //Respuesta solo con body parser
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        apellidos: body.apellidos,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save( ( err, usuarioGuardado ) => {

        if ( err ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuarios',
                errors: err
            }); 
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });

    });

    

});


module.exports = app;