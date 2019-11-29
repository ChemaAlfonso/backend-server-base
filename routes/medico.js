// Inicio express
var express = require('express');
var app = express();

// Middlewares
var authMiddlewares = require('../middlewares/auth');

// =============================
// Importar modelo de hospital
// =============================
var Medico = require('../models/medico');

// =============================
// Obtener todos los hospitales
// =============================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number( desde );

    Medico.find( {}, 'nombre usuario hospital')

        .skip(desde)
        .limit(30)
        
    // Recoge los valores de la subconsulta
    .populate( 'usuario', 'nombre email' )
    .populate( 'hospital' )
    .exec( (err, medicos ) => {
        if ( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al cargar medicos',
                errors: err
            }); 
        }
        
        Medico.count({}, (err, conteo) => {
                    
            res.status(200).json({
                ok: true,
                total: conteo,
                medicos
            });

        })


    });

});

// =============================
// Crear medicos
// =============================
app.post('/', authMiddlewares.vericaToken, (req, res, next) => {
   
    let body = req.body;

    let medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    })
    
    medico.save( ( err, medicoGuardado ) => {

        if ( err ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el medico',
                errors: err,
                body
            }); 
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });

    });

});

// =============================
// Actualizar médicos
// =============================
app.put('/:id', authMiddlewares.vericaToken, (req, res, next) => {
   
    let id   = req.params.id;
    let body = req.body;

    Medico.findById(id, (err, med) => {               

        if ( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar médicos',
                errors: err
            }); 
        }

        if (!res){
            return res.status(400).json({
                ok: false,
                mensaje: 'En medico con el id ' + id + ' no existe.',
                errors: {message: 'No existe un medico con ese id'}
            });
        }

        med.nombre  = body.nombre;
        med.img     = body.img;
        med.usuario = req.usuario._id;
         
        med.save( ( err, medicoGuardado ) => {

            if ( err ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear el medico',
                    errors: err,
                    body
                }); 
            }

            res.status(201).json({
                ok: true,
                medico: medicoGuardado
            });

        });

    });   

});

// =============================
// Eliminar hospitales
// =============================
app.delete('/:id', authMiddlewares.vericaToken, ( req, res ) => {
    let id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoEliminado) => {

        if ( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            }); 
        }

        if ( !medicoEliminado ){
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico no existe',
                errors: err
            }); 
        }

        res.status(200).json({
            ok: true,
            medico: medicoEliminado
        });
    });
});

module.exports = app;

