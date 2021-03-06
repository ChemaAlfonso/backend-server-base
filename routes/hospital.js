// Inicio express
var express = require('express');
var app = express();


// Middlewares
var authMiddlewares = require('../middlewares/auth');

// =============================
// Importar modelo de hospital
// =============================
var Hospital = require('../models/hospital');

// =============================
// Obtener todos los hospitales
// =============================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number( desde );

    Hospital.find( {} )

        .skip(desde)
        .limit(5)

    // Recoge los valores de la subconsulta
    .populate( 'usuario', 'nombre email' )
    .exec( (err, hospitales ) => {
        if ( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al cargar hospitales',
                errors: err
            }); 
        }

         
        Hospital.count({}, (err, conteo) => {
                    
            res.status(200).json({
                ok: true,
                total: conteo,
                hospitales
            });

        })

        
    });

});

// =============================
// Crear hospitales
// =============================
app.post('/', authMiddlewares.vericaToken, (req, res, next) => {
   
    let body = req.body;

    let hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    })
    
    hospital.save( ( err, hospitalGuardado ) => {

        if ( err ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el hospital',
                errors: err,
                body
            }); 
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });

    });

});

// =============================
// Actualizar hospitales
// =============================
app.put('/:id', authMiddlewares.vericaToken, (req, res, next) => {
   
    let id   = req.params.id;
    let body = req.body;

    Hospital.findById(id, (err, hosp) => {               

        if ( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospitales',
                errors: err
            }); 
        }

        if (!res){
            return res.status(400).json({
                ok: false,
                mensaje: 'En hospital con el id ' + id + ' no existe.',
                errors: {message: 'No existe un hospital con ese id'}
            });
        }

        hosp.nombre  = body.nombre;
        hosp.usuario = req.usuario._id;
         
        hosp.save( ( err, hospitalGuardado ) => {

            if ( err ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear el hospital',
                    errors: err,
                    body
                }); 
            }

            res.status(201).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });


    });
   

});

// =============================
// Eliminar hospitales
// =============================
app.delete('/:id', authMiddlewares.vericaToken, ( req, res ) => {
    let id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalEliminado) => {

        if ( err ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            }); 
        }

        if ( !hospitalEliminado ){
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital no existe',
                errors: err
            }); 
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalEliminado
        });
    });
});

// ========================================== 
//  Obtener Hospital por ID 
// ========================================== 
app.get("/:id", (req, res) => {
  var id = req.params.id;

  Hospital.findById(id)
    .populate("usuario", "nombre apellidos img email")
    .exec((err, hospital) => {
      if (err) {
        return res
          .status(500)
          .json({
            ok: false,
            mensaje: "Error al buscar hospital",
            errors: err
          });
      }

      if (!hospital) {
        return res
          .status(400)
          .json({
            ok: false,
            mensaje: "El hospital con el id " + id + " no existe",
            errors: { message: "No existe un hospital con ese ID" }
          });
      }

      res.status(200).json({
           ok: true, 
           hospital: hospital
      });
      
    });
});

module.exports = app;

