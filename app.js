// Requires
var express = require('express');
var mongoose = require('mongoose');



//Inicializar variables
var app = express();


//Conexion DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res ) => {

    if ( err ) throw err;
    
    console.log('BBDD: \x1b[32m%s\x1b[0m','online');

});

//Rutas

//tipoDePeticion('path', Callback(req, res, next))
/* ejemplo
app.get('/', (req, res, next) => {

    res.status(200).json({})

});
*/

app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada con éxito'
    })

});

// Escucha de peticiones
app.listen( 3000, () => {
    console.log('Express server en el puerto 3000: \x1b[32m%s\x1b[0m','online');
})