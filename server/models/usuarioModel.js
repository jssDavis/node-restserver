const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{value} no es un rol válido '
}

let Schema = mongoose.Schema;

let usuarioEschema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'El password es requerido']
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos

    },
    estado: {
        type: Boolean,
        default: true,
        required: [true, 'El Estado del usuario es requerido']
    },
    google: {
        type: Boolean,
        default: false,
        required: [true, 'La propiedad Google es requeridas']
    }
});

usuarioEschema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

usuarioEschema.plugin(uniqueValidator, { message: '{PATH} debe ser único ' })

module.exports = mongoose.model('UsuarioModel', usuarioEschema);