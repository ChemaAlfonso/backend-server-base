// JWT
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// =============================
// Verificar token
// =============================
exports.vericaToken = (req, res, next) => {
    let token = req.query.token;

    jwt.verify( token, SEED, (err, decoded) => {
        if ( err ){
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            }); 
        }
        req.usuario = decoded.usuario;
        
        next();
    });
}

exports.vericaAdmin = (req, res, next) => {
    
    let usuario = req.usuario;

    if( usuario.role === 'ADMIN_ROL'){
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto',
            errors: {message: 'No tiene permisos para realizar esta acción'}
        }); 
    }
}

exports.vericaAdminOrOwn = (req, res, next) => {
    
    let usuario = req.usuario;
    var id = req.params.id;

    if( usuario.role === 'ADMIN_ROL' || usuario._id === id){
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto',
            errors: {message: 'No tiene permisos para realizar esta acción'}
        }); 
    }
}

