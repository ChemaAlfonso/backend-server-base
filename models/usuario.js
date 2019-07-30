var mongoose = require( 'mongoose' );

var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROL', 'USER_ROL'],
    message: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    apellidos: { type: String, required: [true, 'Los apellidos son necesarios'] },
    email: { type: String, unique:true, required: [true, ' El correo es necesario'] },
    password: { type: String, required: [true, ' La contraseña es necesaria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROL', enum: rolesValidos },

});

usuarioSchema.plugin( uniqueValidator, {message: '{PATH} debe ser único'});

module.exports = mongoose.model('Usuario', usuarioSchema);