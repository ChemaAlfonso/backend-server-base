var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

/* 

    express().tipoDePeticion('path', Callback(req, res, next))

    ejemplo
    app.get('/', (req, res, next) => {

        res.status(200).json({})

    });

*/

// **************************************
// * Busqueda por colección
// **************************************
app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {

    var tabla = req.params.tabla.toLowerCase();
    var busqueda = req.params.busqueda;
    var regex = new RegExp( busqueda, 'i' );

    var results;

    switch (tabla) {
        case 'hospitales':
            results = buscarHospitales(busqueda, regex);
            break;

        case 'medicos':
            results = buscarMedicos(busqueda, regex);
            break;

        case 'usuarios':
            results = buscarUsuarios(busqueda, regex);
            break;
    
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Error en la consulta'
            });
    }

    results.then( respuestas => {

            res.status(200).json({
                ok: true,
                mensaje: 'Peticion realizada con éxito',
                [tabla]: respuestas
            });

    });


});

// **************************************
// * Busqueda General
// **************************************
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp( busqueda, 'i' );

    Promise.all([ 
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios( busqueda, regex )])
        .then( respuestas => {

            res.status(200).json({
                ok: true,
                mensaje: 'Peticion realizada con éxito',
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });

    });


});

function buscarHospitales( busqueda, regex ){

    return new Promise( (res, rej) => {
        Hospital.find({ nombre: regex })
        .populate('usuario', 'nombre email img')
        .exec( (err, hospitales) => {

            if( err ){
                rej('Error al cargar hospitales', err);                
            } else {
                res( hospitales );
            }

        });
    });

}

function buscarMedicos( busqueda, regex ){

    return new Promise( (res, rej) => {
        Medico.find({ nombre: regex })
        .populate('usuario', 'nombre email img')
        .populate('hospital')
        .exec( (err, medicos) => {

            if( err ){
                rej('Error al cargar medicos', err);                
            } else {
                res( medicos );
            }
            
        });
    });
    
}

function buscarUsuarios( busqueda, regex ){

    return new Promise( (res, rej) => {
        Usuario.find({}, 'nombre apellidos email role img')
            .or([ { 'nombre': regex }, { 'email': regex} ])
            .exec( (err, usuarios) => {

                if( err ){
                    rej('Error al cargar usuarios', err);                
                } else {
                    res( usuarios );
                }
        
            });
    });
    
}

module.exports = app;