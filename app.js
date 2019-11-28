// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');



//Inicializar variables
var app = express();


//Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Importar rutas
var appRoutes = require('./routes/app');
var usrRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalesRoutes = require('./routes/hospital');
var medicosRoutes = require('./routes/medico');


//Conexion DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true }, ( err, res ) => {

    if ( err ) throw err;
    
    console.log('BBDD: \x1b[32m%s\x1b[0m','online');

});

//Rutas
app.use('/usuario', usrRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalesRoutes);
app.use('/medico', medicosRoutes);
app.use('/', appRoutes);


// Escucha de peticiones
app.listen( 3000, () => {
    console.log('Express server en el puerto 3000: \x1b[32m%s\x1b[0m','online');
})