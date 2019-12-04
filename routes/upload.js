var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

// Models
var Usuario  = require('../models/usuario');
var Medico   = require('../models/medico');
var Hospital = require('../models/hospital');


// default options
app.use(fileUpload());

/* 

    express().tipoDePeticion('path', Callback(req, res, next))

    ejemplo
    app.get('/', (req, res, next) => {

        res.status(200).json({})

    });

*/

app.put('/:coleccion/:id', (req, res, next) => {

    var coleccion = req.params.coleccion;
    var id        = req.params.id;

    // Collecciones validas
    var validColections = ['hospitales', 'usuarios', 'medicos'];
    if( validColections.indexOf(coleccion) < 0 ){
        return res.status(400).json({
            ok: false,
            mensaje: 'Error al cargar la imagen',
            errors: {message: 'La colección no es válida'}
        }); 
    }
    
    if( !req.files ){
        return res.status(400).json({
            ok: false,
            mensaje: 'Error al cargar la imagen',
            errors: {message: 'Debe seleccionar una imagen'}
        }); 
    }

    // Obtener nombre de archivo
    var archivo = req.files.imagen;
    var splitedName = archivo.name.split('.');
    var extArchivo = splitedName[ splitedName.length - 1 ];

    // Extensiones válidas
    var validExts = ['png', 'jpg', 'jpeg', 'gif'];

    if( validExts.indexOf( extArchivo ) < 0 ){
        return res.status(400).json({
            ok: false,
            mensaje: 'Error al cargar la imagen',
            errors: {message: 'Formato de imagen no valido, solo: ' + validExts.join(', ')}
        }); 
    };

    // Nombre personalizado
    var fileName = `${ id }-${ new Date().getMilliseconds() }.${ extArchivo }`;

    // Mover imagen y guardar
    var path = `./uploads/${ coleccion }/${ fileName }`;
    archivo.mv( path, err => {
        if( err ){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al mover la imagen',
                errors: {message: 'No se ha podido mover la imagen'}
            }); 
        }

        subirPorTipo( coleccion, id, fileName, res );

    });


    

});


// Subir por tipo de coleccion
function subirPorTipo( coleccion, id, fileName, res ){

    if( coleccion == 'usuarios' ){
        Usuario.findById( id , (err, usuario) => {

            if( !usuario ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El usuario no existe',
                    errors: {message: 'El usuario no existe'}
                }); 
            }

            var lastPath = './uploads/usuarios/' + usuario.img;

            // Elimina la anterior si ya existe
            if( fs.existsSync( lastPath ) ){
                fs.unlinkSync( lastPath );
            }

            // Asigna la nueva imagen
            usuario.img = fileName;

            // Guarda el usuario
            usuario.save( ( err, usuarioActualizado ) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada con éxito',
                    usuario: usuarioActualizado
                });

            });

        });
    }

    if( coleccion == 'medicos' ){
        Medico.findById( id , (err, medico) => {

            if( !medico ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El medico no existe',
                    errors: {message: 'El medico no existe'}
                }); 
            }

            var lastPath = './uploads/medicos/' + medico.img;

            // Elimina la anterior si ya existe
            if( fs.existsSync( lastPath )  && medico.img.length > 0 ) {
                fs.unlinkSync( lastPath );
            }

            // Asigna la nueva imagen
            medico.img = fileName;

            // Guarda el medico
            medico.save( ( err, medicoActualizado ) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada con éxito',
                    medico: medicoActualizado
                });
            });

        });
    }

    if( coleccion == 'hospitales' ){
        Hospital.findById( id , (err, hospital) => {

            if( !hospital ){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital no existe',
                    errors: {message: 'El hospital no existe'}
                }); 
            }

            var lastPath = './uploads/hospitales/' + hospital.img;

            // Elimina la anterior si ya existe
            if( fs.existsSync( lastPath ) ){
                fs.unlinkSync( lastPath );
            }

            // Asigna la nueva imagen
            hospital.img = fileName;

            // Guarda el hospital
            hospital.save( ( err, hospitalActualizado ) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen actualizada con éxito',
                    hospital: hospitalActualizado
                });
            });

        });
    }

}


module.exports = app;