var express = require('express');

var app = express();

/* 

tipoDePeticion('path', Callback(req, res, next))

ejemplo
app.get('/', (req, res, next) => {

    res.status(200).json({})

});

*/

app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada con éxito'
    });

});

module.exports = app;