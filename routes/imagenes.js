var express = require('express');
var app = express();

const path = require('path');
const fs   = require('fs');

/* 

    express().tipoDePeticion('path', Callback(req, res, next))

    ejemplo
    app.get('/', (req, res, next) => {

        res.status(200).json({})

    });

*/

app.get('/:coleccion/:img', (req, res, next) => {

    var coleccion = req.params.coleccion;
    var img       = req.params.img;

    var pathImg = path.resolve( __dirname, `../uploads/${ coleccion }/${ img }` );

    if( fs.existsSync( pathImg ) ){
        res.sendFile( pathImg );
    } else {
        var pathNoImg = path.resolve( __dirname, '../assets/no-img.jpg');
        res.sendFile( pathNoImg );
    }

});

module.exports = app;